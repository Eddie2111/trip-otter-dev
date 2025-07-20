"use client"
import { useWebsocket } from "@/lib/useWebsocket";
export default function Test() {
  const socket = useWebsocket({
    path: "/chat", // This MUST match the path defined in your NestJS @WebSocketGateway decorator
    shouldAuthenticate: true, // Set to true if your gateway expects authentication
    autoConnect: true, // Automatically connect when the component mounts
  });
  console.log(socket);
  return (
    <>
      <div className="ml-[400px]">
      </div>
    </>
  );
}
