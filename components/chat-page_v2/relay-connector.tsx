"use client"

import { useWebsocket } from "@/lib/useWebsocket";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { $isConnected, $userLoggedIn, $chatSocket } from "./chat.store";
import { Socket } from "socket.io-client";
import { Session } from "next-auth";
import { chatEvents } from "./constants/events";

const emitLogin = (socket: Socket, session: Session) => {
  socket.emit(chatEvents.login, {
    userId: session.user.id,
    email: session.user.email,
  });
};

type TRelayType = "user" | 'public' | 'group';

export function ChatRelay({relayType}: {relayType: TRelayType}) {
  const { data: session, status: sessionStatus } = useSession();
  const [error, setError] = useState<string>("");

  const socket = useWebsocket({
    path: `/chatv2/${relayType}`,
    shouldAuthenticate: true,
    autoConnect: true,
  });

  useEffect(() => {
    if (socket) {
      $chatSocket.set(socket);
    }
    return () => {
      $chatSocket.set(null);
    };
  }, [socket]);
  
  const onLoginSuccess = useCallback(() => {
    console.log("Login Success: User is now fully authenticated.");
    $userLoggedIn.set(true);
  }, []);

  const onLoginFailure = useCallback(() => {
    console.log("Login Failure: Backend rejected authentication.");
    $userLoggedIn.set(false);
    toast.warning("Failed to connect to the chat relay");
  }, []);

  useEffect(() => {
    if (!socket || sessionStatus === "loading") {
      console.log("Waiting for socket or session data...");
      return;
    }

    const handleConnect = () => {
      $isConnected.set(true);
      if (sessionStatus === "authenticated" && session?.user?.id && session?.user?.email) {
        emitLogin(socket, session);
      } else if (sessionStatus === "unauthenticated") {
        setError("Cannot log in: Session unauthenticated.");
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected.");
      $isConnected.set(false);
      $userLoggedIn.set(false); 
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("loginSuccess", onLoginSuccess);
    socket.on("loginFailure", onLoginFailure);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("loginSuccess", onLoginSuccess);
      socket.off("loginFailure", onLoginFailure);

      $isConnected.set(false);
      $userLoggedIn.set(false);
    };
  }, [socket, session, sessionStatus, onLoginSuccess, onLoginFailure]);
  
  if (error) {
    return <div>Connection Error: {error}</div>;
  }
  
  return (
    <div style={{ padding: '10px', fontSize: '12px', color: 'gray' }}>
    </div>
  )
}