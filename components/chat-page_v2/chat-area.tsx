"use client";

import { useStore } from "@nanostores/react";
import { $chatSocket, $currentChatHistory, $isTyping, $userLayout, ChatStoreOptimization, type IMessageStoreType } from "./chat.store";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useMessageAPI, useUserApi } from "@/lib/requests";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { LoadingSmall } from "../ui/loading";
import { CurrentChatHistory } from "./chat-history-area";
import { IMessage } from "./constants/types";
import { chatEvents } from "./constants/events";
import { MESSAGE_TIMEOUT_MS, RETRY_INTERVAL_MS } from "./constants/constraints";
import { toast } from "sonner";

// export interface IMessage {
//   content: string;
//   recipientId: string;
//   senderId: string;
//   timestamp: number;
//   isSelf: boolean;
//   status: 'sent' | 'delivered' | 'read' | 'failed'
// }

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
        senderId: session?.user?.id,
        recipientId: userOnArea,
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
          $currentChatHistory.set([...userChats, data]);
        }
      };
      chatSocket?.on(chatEvents.newMessage, messageHandler)

      return () => {
        chatSocket?.off(chatEvents.newMessage, messageHandler)
      }
    }, [chatSocket, userChats]
  )

  // attempt to resend the 'sent' or 'failed' messages again
  useEffect(() => {
    if (!chatSocket || !session?.user?.id) return;

    const resendLoop = setInterval(() => {
      const chatStory = $currentChatHistory.get();
      const now = Date.now();

      const messagesToResend = chatStory.filter((msg) => 
        (msg.status === 'sent' || msg.status === 'failed') && 
        msg.isSelf && 
        (now - msg.timestamp) > MESSAGE_TIMEOUT_MS
      );

      if (messagesToResend.length > 0) {
        toast.info(`Retrying ${messagesToResend.length} unsent messages...`);

        messagesToResend.forEach((message) => {
          const payload = {
            message: message.content,
            senderId: message.senderId,
            recipientId: message.recipientId,
            timestamp: message.timestamp
          };
          
          const resendAckHandler = (response: { success: boolean; error?: string; messageId?: number }) => {
            if (!response.success) {
              const current = $currentChatHistory.get();
              const index = current.findIndex(m => m.timestamp === message.timestamp);
              if (index !== -1) {
                const updated = [...current];
                updated[index] = { ...updated[index], status: 'failed' };
                $currentChatHistory.set(updated);
              }
            }
          };
          
          chatSocket.emit(chatEvents.sendMessageToUser, payload, resendAckHandler);
        });
      }
    }, RETRY_INTERVAL_MS);

    return () => clearInterval(resendLoop);
  }, [chatSocket, session]);

  // message delivery listener
  useEffect(
    () => {
      const updateMessageStatus = (data: { messageId: number }) => {
        console.log("message sent at server")
        const chatStory = $currentChatHistory.get();
        const updateRequiredIndex = chatStory.findIndex(
          value => value.timestamp === data.messageId
        )
        ChatStoreOptimization($currentChatHistory)
        if (updateRequiredIndex === -1) return;
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

  // type start status listener
  useEffect(
    () => {
      const typingStatusStartHandler = () => {
        $isTyping.set(true);
      };
      chatSocket?.on(chatEvents.startTyping, typingStatusStartHandler)
      return () => {
        chatSocket?.off(chatEvents.startTyping, typingStatusStartHandler)
      }
    }, [chatSocket, isTyping]
  );

  // type stop status listener
  useEffect(
    () => {
      const typingStatusStopHandler = () => {
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
        userOnArea={userOnArea}
      />
    </div>
  )
}
