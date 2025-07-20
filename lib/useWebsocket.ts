"use client";
import { useMemo } from "react";

import { io } from "socket.io-client";

export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "ACCESS_TOKEN";

export const API_BASE_URL = process.env["NEXT_PUBLIC_API_BASE_URL"];
export const NODE_ENV = process.env["NODE_ENV"] as
  | "production"
  | "development"
  | "local";
export const WS_BASE_URL = "http://localhost:5000" // process.env["NEXT_PUBLIC_WS_BASE_URL"];


// export const setInLocalStorage = <T>(keyName: string, data: T) =>
//   window.localStorage.setItem(keyName, JSON.stringify(data));

// export const getFromLocalStorage = <T>(keyName: string): T | null => {
//   const data = window.localStorage.getItem(keyName);
//   return data ? (JSON.parse(data) as T) : null;
// };


export const useWebsocket = ({
  path,
  shouldAuthenticate = true,
  autoConnect = false,
}: {
  path: string;
  shouldAuthenticate?: boolean;
  autoConnect?: boolean;
}) => {
  const socket = useMemo(() => {
    const accessToken = "access_token";

    return io(WS_BASE_URL ?? "", {
      autoConnect,
      transports: ["websocket"],
      path,
      auth: shouldAuthenticate
        ? {
            authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });
  }, [autoConnect, path, shouldAuthenticate]);

  return socket;
};
