"use client";

import { useRef, useEffect, useMemo } from 'react';
import { Input } from "../ui/input";
import { Check, CheckCheck, CircleAlert, CircleCheck, SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMessage } from "./constants/types";
import { useStore } from '@nanostores/react';
import { $chatSocket, $currentChatHistory, $isTyping, $userLayout } from './chat.store';
import { ChatTypingStatus } from '../ui/loading';
import { chatEvents } from './constants/events';
import { ICurrentChatHistoryProps } from './types';
import { useMessageAPI } from '@/lib/requests';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatTimeAgo } from '@/lib/useTimeFormat';
import { useInView } from "react-intersection-observer";

const messageSchema = z.object({
  message: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

type MessageFormValues = z.infer<typeof messageSchema>;
interface MessageResponse {
  data: IMessage[];
  hasMore: boolean;
  page: number;
}

export function CurrentChatHistory({ 
  chats, 
  messageSender, 
  sender, 
  recipientId, 
  senderId, 
  userOnArea 
}: ICurrentChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatSocket = useStore($chatSocket);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousScrollHeight = useRef(0);
  const previousUserOnArea = useRef(userOnArea);
  const shouldScrollToBottom = useRef(true);
  const isInitialMount = useRef(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery<MessageResponse>({
    queryKey: ['UserChatData', userOnArea, senderId],
    queryFn: async ({ pageParam }) => {
      const response = await useMessageAPI.getMessages(
        senderId ?? "",
        userOnArea,
        pageParam as number,
        20
      );
      return response;
    },
    getNextPageParam: (lastPage: MessageResponse) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userOnArea && !!senderId,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  // Flatten all pages and sort by timestamp (most reliable approach)
  const fetchedMessages = useMemo(() => {
    if (!data?.pages) return [];
    
    // Flatten all pages
    const allMessages = data.pages.flatMap(page => page.data);
    
    // Sort by timestamp ascending (oldest to newest)
    return allMessages.sort((a, b) => a.timestamp - b.timestamp);
  }, [data?.pages]);

  // Clear store and reset when user changes
  useEffect(() => {
    if (previousUserOnArea.current !== userOnArea) {
      $currentChatHistory.set([]);
      shouldScrollToBottom.current = true;
      isInitialMount.current = true;
      previousUserOnArea.current = userOnArea;
      refetch();
    }
  }, [userOnArea, refetch]);

  // Update store with fetched messages (always sorted by timestamp)
  useEffect(() => {
    if (!isLoading && !isError && fetchedMessages.length > 0) {
      const currentStore = $currentChatHistory.get();
      
      if (isInitialMount.current || currentStore.length === 0) {
        // Initial load: just set the fetched messages
        $currentChatHistory.set(fetchedMessages);
        isInitialMount.current = false;
      } else {
        // Pagination: merge and sort by timestamp
        const merged = [...currentStore, ...fetchedMessages];
        
        // Remove duplicates by timestamp and sort
        const uniqueMessages = Array.from(
          new Map(merged.map(msg => [msg.timestamp, msg])).values()
        ).sort((a, b) => a.timestamp - b.timestamp);
        
        $currentChatHistory.set(uniqueMessages);
      }
    }
  }, [fetchedMessages, isLoading, isError]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (shouldScrollToBottom.current && messagesEndRef.current && chats.length > 0 && !isLoading) {
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
        shouldScrollToBottom.current = false;
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [chats.length, isLoading]);

  // Preserve scroll position when loading older messages
  useEffect(() => {
    if (isFetchingNextPage && scrollContainerRef.current) {
      previousScrollHeight.current = scrollContainerRef.current.scrollHeight;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (!isFetchingNextPage && previousScrollHeight.current && scrollContainerRef.current) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeight.current;
      scrollContainerRef.current.scrollTop += scrollDiff;
      previousScrollHeight.current = 0;
    }
  }, [isFetchingNextPage]);

  // Infinite scroll trigger at top
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !shouldScrollToBottom.current) {
      console.log('Loading more messages...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Auto-scroll for new messages
  const typingStatus = useStore($isTyping);
  
  useEffect(() => {
    if (!shouldScrollToBottom.current && messagesEndRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      
      if (distanceFromBottom < 150) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [chats, typingStatus]);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const messageValue = watch("message");

  // Typing indicator
  useEffect(() => {
    if (chatSocket && messageValue.trim()) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      const payload = { senderId, recipientId };
      chatSocket.emit(chatEvents.startTyping, payload);

      typingTimerRef.current = setTimeout(() => {
        chatSocket.emit(chatEvents.stopTyping, payload);
      }, 2000);
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        if (chatSocket) {
          chatSocket.emit(chatEvents.stopTyping, { senderId, recipientId });
        }
      }
    };
  }, [messageValue, chatSocket, senderId, recipientId]);

  const onSubmit = (data: MessageFormValues) => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    if (chatSocket) {
      chatSocket.emit(chatEvents.stopTyping, { senderId, recipientId });
    }

    messageSender(data.message);
    reset();
  };

  const messageStatusIndicator = (status: string) => {
    if (status === "sent") return <Check className="text-[12px] h-[12px] w-[12px]" />;
    if (status === 'delivered') return <CheckCheck className="text-blue-500 text-[12px] h-[12px] w-[12px]" />;
    if (status === 'read') return <CircleCheck className="text-green-500 text-[12px] h-[12px] w-[12px]" />;
    if (status === 'failed') return <CircleAlert className="text-red-500 text-[12px] h-[12px] w-[12px]" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh]">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] text-red-500">
        Failed to load messages.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div 
        ref={scrollContainerRef}
        className="overflow-y-auto h-[75vh]"
      >
        {/* Load more trigger at top */}
        <div ref={loadMoreRef} className="py-2 text-center text-sm text-gray-500">
          {isFetchingNextPage && 'Loading older messages...'}
          {!isFetchingNextPage && hasNextPage && chats.length > 0 && ''}
        </div>

        {/* Display messages */}
        {chats.map((messages: IMessage, index: number) => (
          <div key={`${messages.timestamp}-${index}`}>
            {messages.recipientId === userOnArea ? (
              // Sent by current user
              <div className="flex flex-col">
                <div className="flex flex-row justify-end">
                  <p className="text-xs text-slate-500 mt-10">
                    {messageStatusIndicator(messages.status)}
                  </p>
                  <p className="text-right m-2 p-2 max-w-[300px] bg-slate-500 shadow-sm shadow-slate-600 rounded-xl text-white">
                    {messages.content}
                  </p>
                </div>
                <p className="text-right text-xs text-slate-500 mr-12">
                  {formatTimeAgo(messages.timestamp)}
                </p>
              </div>
            ) : (
              // Received from other user
              <div className="flex flex-col">
                <div className="flex flex-row justify-start">
                  <img 
                    src={sender.profileImage ?? "placeholder.jpg"} 
                    alt="Sender"
                    className="w-10 h-12 rounded-full mt-1" 
                  />
                  <p className="text-left m-2 p-2 max-w-[40%] bg-gradient-to-br from-[#0099DB] to-[#00F0E4] text-black rounded-xl">
                    {messages.content}
                  </p>
                </div>
                <p className="text-left text-xs text-slate-500 ml-12">
                  {formatTimeAgo(messages.timestamp)}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typingStatus && <ChatTypingStatus />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form className="flex flex-row mt-2 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" {...register("message")} placeholder="Type a message..." />
        <Button type="submit" disabled={isSubmitting}>
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}