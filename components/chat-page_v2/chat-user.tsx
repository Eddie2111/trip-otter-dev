import Link from "next/link";
import { ILatestMessage } from "./types";
import { formatTimeAgo } from "@/lib/useTimeFormat";

interface IChatUserProps {
  _id?: string;
  id?: string;
  fullName: string;
  message?: string;
  timestamp?: string;
  profileImage?: string;
}

export function ChatUser({ ChatUserProp, onClick }: { ChatUserProp: IChatUserProps, onClick: () => void; }) {
  const chatLink = `/test?user=${ChatUserProp._id ? ChatUserProp._id : ChatUserProp.id}`;
  return (
    <Link href={chatLink} shallow onClick={onClick}>
      <div className="flex flex-row gap-1 m-2">
        <img
          src={ChatUserProp.profileImage ? ChatUserProp.profileImage : "placeholder-logo.png"}
          width="30"
          height="30"
          className="rounded-full" />
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <p>{ChatUserProp.fullName}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface IChatUserMessageProps { 
  ChatUserProp: IChatUserProps, 
  ChatUserMessage: ILatestMessage, 
  ChatUserMessageTime: number, 
  onClick: () => void; 
}

export function ChatUserMessages({ ChatUserProp, ChatUserMessage, ChatUserMessageTime, onClick }: IChatUserMessageProps ) {
  const chatLink = `/test?user=${ChatUserProp._id ? ChatUserProp._id : ChatUserProp.id}`;
  return (
    <Link href={chatLink} shallow onClick={onClick} className='flex flex-row gap-1 m-2'>
      <div className="flex flex-row gap-1 m-2">
        <img
          src={ChatUserProp.profileImage ? ChatUserProp.profileImage : "placeholder-logo.png"}
          width="70"
          className="rounded-full h-16 w-16" />
        <div className="flex flex-col">

          <div className="flex flex-row gap-2">
            <p>{ChatUserProp.fullName}</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs">{ChatUserMessage.content ?? ""} </div>
            <div className="text-xs">{formatTimeAgo(ChatUserMessageTime) ?? ""}</div>
          </div>

        </div>
      </div>
    </Link>
  )
}
