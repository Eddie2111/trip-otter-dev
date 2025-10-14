"use client";

import { useSearchAPI } from "@/lib/requests";
import { Input } from "../ui/input";
import { $currentChatHistory, $isTyping, $userLayout, $userLoggedIn } from "./chat.store";
import { useStore } from '@nanostores/react';
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChatUser } from "./chat-user";

export function ChatUsers() {
  const userLoggedIn = useStore($userLoggedIn);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
  console.log(data, isLoading, isError);

  return (
    <div className="border-2 border-red-500 min-w-[240px]">
      <Input
        type="text"
        placeholder="Search messages"
        className="dark:bg-slate-500 placeholder:text-white w-full"
        value={inputValue}
        onChange={handleInputChange}
      />
      {
        userLoggedIn ?
          <span className="text-green-500">connected</span> :
          <span className="text-red-500">connecting</span>
      }
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
        {!searchQuery && <p>Start typing to search.</p>}
      </div>
    </div>
  )
}

