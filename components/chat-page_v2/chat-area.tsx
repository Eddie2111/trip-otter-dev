"use client";

import { useStore } from "@nanostores/react";
import { $chatSocket, $currentChatHistory, $userLayout } from "./chat.store";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useUserApi } from "@/lib/requests";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { LoadingSmall } from "../ui/loading";
import { CurrentChatHistory } from "./chat-history-area";

interface IMessage {
  content: string;
  recipientId: string;
  senderId: string;
  timestamp: number;
}

export function ChatArea() {
  const userOnArea = useStore($userLayout);
  const { data: session } = useSession();
  const chatSocket = useStore($chatSocket);
  const userChats = useStore($currentChatHistory);


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

  // message emitter
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const message = e.target.value;
    if (chatSocket) {
      chatSocket.emit("sendMessageToUser",
        {
          "message": message,
          by: session?.user?.id,
          to: userOnArea,
        });
    } else {
      console.error("Chat socket is not yet connected/authenticated.");
    }
  };

  // message emitter-> v2
  const handleMessageEmit = (
    message: string
  ) => {
    if (chatSocket) {
      const payload = {
        "message": message,
        by: session?.user?.id,
        to: userOnArea,
      }
      chatSocket.emit("sendMessageToUser", payload);
      $currentChatHistory.set([...userChats, {
        content: message,
        recipientId: userOnArea,
        senderId: session?.user?.id ?? "",
        timestamp: Date.now(),
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
          console.log([...userChats, data]);
          chatSocket.emit("messageReceived", { messageId: data.timestamp });
        }
      };
      chatSocket?.on("newMessage", messageHandler)

      return () => {
        chatSocket?.off("newMessage", messageHandler)
      }
    }, [chatSocket, userChats]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col w-full mx-2">
        <div><LoadingSmall /></div>
        <Separator />
        <input type="text" onChange={handleInputChange} name="message" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full mx-2">
      <p>{profileData?.fullName ?? ""}</p>
      <Separator />
      <CurrentChatHistory chats={userChats} messageSender={handleMessageEmit} />
    </div>
  )
}
