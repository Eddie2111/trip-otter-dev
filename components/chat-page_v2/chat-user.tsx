import Link from "next/link";

interface ChatUserProps {
  _id: string;
  fullName: string;
  message?: string;
  timestamp?: string;
  profileImage: string;
}

export function ChatUser({ ChatUserProp }: { ChatUserProp: ChatUserProps }) {
  const chatLink = `/test?user=${ChatUserProp._id}`;
  return (
    <Link href={chatLink} shallow>
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
          <p>{ChatUserProp.message ?? ""}</p>
        </div>
      </div>
    </Link>
  )
}
