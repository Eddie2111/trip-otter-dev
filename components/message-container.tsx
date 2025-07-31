"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useWebsocket } from "@/lib/useWebsocket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const MessageContainer = () => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [error, setError] = useState<string | null>(null);
  const socket = useWebsocket({
    path: "/chat",
    shouldAuthenticate: true,
    autoConnect: true,
  });
  const handleLogin = useCallback(() => {
    if (
      !socket?.connected ||
      status !== "authenticated" ||
      !session?.user?.id ||
      !session?.user?.email
    ) {
      setError(
        "Cannot log in: Socket not connected or session not authenticated."
      );
      return;
    }

    socket.emit("userLogin", {
      userId: session?.user?.id ?? "0",
      username: session?.user?.email,
    });

    console.log(
      `Attempted login for User ID: ${session?.user?.id}, Username: ${session?.user?.email}`
    );
  }, [socket, session, status]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        handleLogin();
        setIsConnected(true);
        console.log("Chat socket connected!");
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Chat socket disconnected!");
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket, handleLogin]);

  useEffect(() => {
    if (isConnected && socket && userId) {
      socket.on("privateMessage", (message: any) => {
        if (message.receiver === userId && message.sender !== userId) {
          setUnreadMessageCount((prev) => prev + 1);
          // console.log(
          //   "New private message received (for unread count):",
          //   message
          // );
        }
      });
      socket.on("globalMessage", (message: any) => {
        setUnreadMessageCount((prev) => prev + 1);
        // console.log("New global message received (for unread count):", message);
      });
      socket.on("groupMessage", (message: any) => {
        setUnreadMessageCount((prev) => prev + 1);
        // console.log("New group message received (for unread count):", message);
      });

      return () => {
        socket.off("privateMessage");
        socket.off("globalMessage");
        socket.off("groupMessage");
      };
    }
  }, [isConnected, socket, userId]);

  const handleChatLinkClick = () => {
    setUnreadMessageCount(0);
  };

  return (
    <Link href="/chat" passHref onClick={handleChatLinkClick}>
      <button
        className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Messages"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadMessageCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadMessageCount}
          </span>
        )}
      </button>
    </Link>
  );
};
