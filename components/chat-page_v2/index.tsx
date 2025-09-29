import { ChatLayoutContainer } from "@/components/chat-page_v2/layout-container";
import { ChatRelay } from "@/components/chat-page_v2/relay-connector";

export default function ChatPage_V2() {
  return (
    <ChatLayoutContainer>
      <ChatRelay />
    </ChatLayoutContainer>
  )
}