"use client";

import { useMessageAPI, useSearchAPI } from "@/lib/requests";
import { Input } from "../ui/input";
import { $currentChatHistory, $isTyping, $userLayout, $userLoggedIn } from "./chat.store";
import { useStore } from '@nanostores/react';
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChatUser, ChatUserMessages } from "./chat-user";
import { useSession } from "next-auth/react";
import { IConversationPayload } from "./types";


export function ChatUsers() {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  // user message listener
  const { data: messageListener, isLoading: isLoadingUserMessages, isError: isErrorUserMessages } = useQuery({
    queryKey: ["chatUsers", 'chatUsers'],
    queryFn: async () => {
      const response = await useMessageAPI.messageListenerForUser(loggedInUserId ?? "", 1, 10);
      if (!response.data) {
        throw new Error("Failed to fetch user profile");
      }
      return response.data;
    },
    enabled: !!loggedInUserId,
    staleTime: 1000 * 60 * 15,
  });
  console.log(messageListener)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== inputValue.trim()) {
        setSearchQuery(inputValue.trim());
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  // search for a user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchUser", searchQuery],
    queryFn: async () => {
      const response = await useSearchAPI.search("", searchQuery);
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to fetch user data.");
      }
      return response.data;
    },
    enabled: !!searchQuery,
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const cleanUpSearchParam = () => {
    setInputValue('');
    setSearchQuery('');
  }

  return (
    <div className="border-2 border-red-500 min-w-[240px]">
      <Input
        type="text"
        placeholder="Search messages"
        className="dark:bg-slate-500 placeholder:text-white w-full"
        value={inputValue}
        onChange={handleInputChange}
      />
      <div className="border-2 border-green-500 my-2">
        {isLoading && searchQuery && <p>Searching...</p>}
        {isError && <p className="text-red-500">Error fetching data.</p>}
        {data && data.users.length > 0 && (
          <ul>
            {data.users.map((user: any) => {
              return (
                <ChatUser key={user._id} ChatUserProp={user} onClick={() => {
                  cleanUpSearchParam();
                  $userLayout.set(user._id);
                  $currentChatHistory.set([]);
                  $isTyping.set(false);
                }} />
              )
            }
            )}
          </ul>
        )}
        {data && searchQuery && data.length === 0 && <p>No users found.</p>}
      </div>
      <div className="flex flex-col">
        {messageListener && messageListener.length > 0 && messageListener.map((user: IConversationPayload) => {
          return (
            <ChatUserMessages 
            key={user.contactId} 
            ChatUserProp={user.contact} 
            ChatUserMessage={user.latestMessage} 
            ChatUserMessageTime={user.lastMessageAt} 
            onClick={() => {
              cleanUpSearchParam();
              $userLayout.set(user.contactId);
              $currentChatHistory.set([]);
              $isTyping.set(false);
            }} />
          )
        })}

      </div>

    </div>
  )
}

