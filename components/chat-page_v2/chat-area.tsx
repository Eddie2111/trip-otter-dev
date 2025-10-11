"use client";

import { useStore } from "@nanostores/react";
import { $chatSocket, $currentChatHistory, $isTyping, $userLayout, type IMessageStoreType } from "./chat.store";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useUserApi } from "@/lib/requests";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { LoadingSmall } from "../ui/loading";
import { CurrentChatHistory } from "./chat-history-area";
// import { IMessage } from "./constants/types";
import { chatEvents } from "./constants/events";

export interface IMessage {
  content: string;
  recipientId: string;
  senderId: string;
  timestamp: number;
  isSelf: boolean;
  status: 'sent' | 'delivered' | 'read'
}

export function ChatArea() {
  const userOnArea = useStore($userLayout);
  const { data: session } = useSession();
  const chatSocket = useStore($chatSocket);
  const userChats = useStore($currentChatHistory);
  const isTyping = useStore($isTyping);

  // profile fetcher
  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ["chatarea", userOnArea],
    queryFn: async () => {
      const response = await useUserApi.getUser(userOnArea);
      if (!response.data) {
        throw new Error("Failed to fetch user profile");
      }
      return response.data;
    },
    enabled: !!userOnArea,
    staleTime: 1000 * 60 * 15,
  });

  // message emitter-> v2
  const handleMessageEmit = (
    message: string
  ) => {
    if (chatSocket) {
      const timestamp = Date.now();
      const payload = {
        message,
        by: session?.user?.id,
        to: userOnArea,
        timestamp
      }
      chatSocket.emit(chatEvents.sendMessageToUser, payload);
      $currentChatHistory.set([...userChats, {
        content: message,
        recipientId: userOnArea,
        senderId: session?.user?.id ?? "",
        timestamp,
        isSelf: true,
        status: 'sent',
      }]);
    } else {
      console.error("Chat socket is not yet connected/authenticated.");
    }
  };

  // new message listener
  useEffect(
    () => {
      const messageHandler = (data: IMessage) => {
        console.log("New Message Received:", data);
        if (chatSocket && data.timestamp) {
          $currentChatHistory.set([...userChats, { ...data, isSelf: false }]);
          console.log([...userChats, { ...data, isSelf: false }]);
          chatSocket.emit(chatEvents.messageReceived, { messageId: data.timestamp });
        }
      };
      chatSocket?.on(chatEvents.newMessage, messageHandler)

      return () => {
        chatSocket?.off(chatEvents.newMessage, messageHandler)
      }
    }, [chatSocket, userChats]
  )

  function ChatStoreOptimization(chatStore: IMessageStoreType): void {
    const chatStoreLength = chatStore.get().length;
    const MAX_MESSAGES = 500;
    if (chatStoreLength > MAX_MESSAGES) {
      chatStore.set(
        chatStore.get()
          .slice(chatStoreLength - MAX_MESSAGES)
      );
    } else {
      return;
    }
  }
  useEffect(
    () => {
      const updateMessageStatus = (data: { messageId: number }) => {
        console.log("message sent at server")
        const chatStory = $currentChatHistory.get();
        const updateRequiredIndex = chatStory.findIndex(
          value => value.timestamp === data.messageId
        )
        // update updateRequiredIndex and set the store
        ChatStoreOptimization($currentChatHistory)
        // if (updateRequiredIndex === -1) return;
        let updatedChatStory = [...chatStory];
        updatedChatStory[updateRequiredIndex] = {
          ...updatedChatStory[updateRequiredIndex],
          status: 'delivered',
        };
        $currentChatHistory.set(updatedChatStory);
        console.log(updatedChatStory, updateRequiredIndex, data);
      }
      if (chatSocket) {
        chatSocket?.on(chatEvents.messageReceived, updateMessageStatus);
        return () => {
          chatSocket?.off(chatEvents.messageReceived, updateMessageStatus);
        }
      }
    }, [chatSocket]
  )
  useEffect(
    () => {
      const typingStatusStartHandler = (data: IMessage) => {
        $isTyping.set(true);
      };
      chatSocket?.on(chatEvents.startTyping, typingStatusStartHandler)
      return () => {
        chatSocket?.off(chatEvents.startTyping, typingStatusStartHandler)
      }
    }, [chatSocket, isTyping]
  );

  useEffect(
    () => {
      const typingStatusStopHandler = (data: IMessage) => {
        $isTyping.set(false);
      };
      chatSocket?.on(chatEvents.stopTyping, typingStatusStopHandler)
      return () => {
        chatSocket?.off(chatEvents.stopTyping, typingStatusStopHandler)
      }
    }, [chatSocket, isTyping]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col w-full mx-2">
        <div><LoadingSmall /></div>
        <Separator />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full mx-2">
      <p>{profileData?.fullName ?? ""}</p>
      <Separator />
      <CurrentChatHistory
        chats={userChats}
        messageSender={handleMessageEmit}
        sender={profileData}
        recipientId={userOnArea}
        senderId={session?.user?.id ?? ""}
      />
    </div>
  )
}
