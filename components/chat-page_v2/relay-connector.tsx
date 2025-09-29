"use client"

import { useWebsocket } from "@/lib/useWebsocket";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function ChatRelay() {
  const [isConnected, setIsConnected] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const { data: session } = useSession();
  const [error, setError] = useState<string>("");

  const socket = useWebsocket({
    path: "/chatv2",
    shouldAuthenticate: true,
    autoConnect: true,
  });

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
        setIsConnected(true);
        loginToSocket();
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const loginToSocket = useCallback(() => {
    console.log("phase 1")
    if (
      !socket?.connected ||
      !session?.user?.id ||
      !session?.user?.email
    ) {
      setError(
        "Cannot log in: Socket not connected or session not authenticated."
      );
      return;
    }
    console.log("phase 2")
    socket.emit("login", {
      userId: session.user.id,
      email: session.user.email,
    });
    console.log("phase 3")
  }, [socket, session]);

  const onLoginSuccess = () => {
    console.log("hit");
    setUserLoggedIn(true);
  };

  const onLoginFailure = () => {
    console.log("hit failed");
    setUserLoggedIn(false);
    toast.warning("Failed to connect to the chat relay");
  };

  useEffect(() => {
    if (socket) {
      socket.on("loginSuccess", onLoginSuccess);
      socket.on("loginFailure", onLoginFailure);

      return () => {
        socket.off("loginSuccess", onLoginSuccess);
        socket.off("loginFailure", onLoginFailure);
      };
    }
  }, [socket, onLoginSuccess, onLoginFailure]);


  return (
    <div>
      Chat relay
      <div>errors (if any): {error ? "none" : error}</div>
      <div>User logged in: {userLoggedIn.toString()}</div>
    </div>
  )
}