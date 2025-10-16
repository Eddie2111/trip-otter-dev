"use client";
// layout wrapper for chat-v2
// this is the only component that should be exported to page.tsx

import { useSearchParams } from "next/navigation";

import { ChatArea } from "./chat-area";
import { ChatUsers } from "./chat-users";
import { ChatLayoutContainer } from "@/components/chat-page_v2/layout-container";

import { ChatRelay } from "./relay-connector";
import { ChatSettings, ChatSettingsLoader } from "./chat-settings";

export default function ChatPage_V2() {
  const searchParams = useSearchParams();

  const userLayout = searchParams.get('user');
  const groupLayout = searchParams.get('group');
  const publicLayout = searchParams.get('public');

  if (userLayout) {
    return (
      <>
        <ChatRelay relayType="user" />
        <ChatLayoutContainer>
          <ChatUsers />
          <ChatArea />
          <ChatSettings />
        </ChatLayoutContainer>
      </>
    )
  }
  if (groupLayout) {
    return (
      <>
        <ChatRelay relayType="group" />
        <ChatLayoutContainer>
          <ChatUsers />
          <ChatArea />
          <ChatSettings />
        </ChatLayoutContainer>
      </>
    )
  }
  if (publicLayout) {
    return (
      <>
        <ChatRelay relayType="public"/>
        <ChatLayoutContainer>
          <ChatUsers />
          <ChatArea />
          <ChatSettings />
        </ChatLayoutContainer>
      </>
    )
  }
  else {
    return (
      <>
        <p> Pick a inbox to start chatting </p>
        <ChatLayoutContainer>
          <ChatUsers />
          <ChatArea />
          <ChatSettingsLoader />
        </ChatLayoutContainer>
      </>
    )
  }
}
