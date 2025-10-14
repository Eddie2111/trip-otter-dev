"use client";

import { useRef, useEffect } from 'react';

import { Input } from "../ui/input";
import { Check, CheckCheck, CircleAlert, CircleCheck, SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMessage } from "./constants/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useStore } from '@nanostores/react';
import { $chatSocket, $currentChatHistory, $isTyping, $userLayout } from './chat.store';
import { ChatTypingStatus } from '../ui/loading';
import { chatEvents } from './constants/events';
import { ICurrentChatHistoryProps } from './types';
import { useMessageAPI } from '@/lib/requests';
import { useQuery } from '@tanstack/react-query';
import { messages } from '@/data/mocks/chat.mock';

dayjs.extend(relativeTime);

const messageSchema = z.object({
  message:
    z.string()
      .min(1, "Message cannot be empty")
      .max(1000, "Message is too long"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function CurrentChatHistory({ chats, messageSender, sender, recipientId, senderId, userOnArea }: ICurrentChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSocket = useStore($chatSocket);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // old message fetcher
  const { data: messagesData, isLoading: loadingMessages, isError: messagesError } = useQuery({
    queryKey: ["chatData", userOnArea],
    queryFn: async () => {
      const response = await useMessageAPI.getMessages(senderId ?? "", userOnArea, 1, 10);
      if (!response) {
        throw new Error("Failed to fetch user profile");
      }
      if (response) {
        const _response = response as unknown as IMessage[];
        console.log(_response, "check me")
      }
      return response;
    },
    enabled: !!userOnArea && !!senderId,
    staleTime: 1000 * 60 * 15,
  })
  console.log(messagesData, "what is this?")

  useEffect(() => {
  if (messagesData && !loadingMessages && !messagesError) {
    // Only update if we're still chatting with the same user
    if ($userLayout.get() === userOnArea) {
      const _messagesData = messagesData as unknown as IMessage[]
      $currentChatHistory.set(_messagesData);
    }
  }
}, [messagesData, loadingMessages, messagesError, userOnArea]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const messageValue = watch("message");
  const typingStatus = useStore($isTyping);

  useEffect(() => {
    if (chatSocket && messageValue) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      const payload = {
        senderId,
        recipientId,
      };
      chatSocket.emit(chatEvents.startTyping, payload);

      typingTimerRef.current = setTimeout(() => {
        chatSocket.emit(chatEvents.stopTyping, payload);
      }, 2000);
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [messageValue, chatSocket, senderId, recipientId]);

  const formatTimeAgo = (timestampValue: number) => {
    const date = dayjs(timestampValue);
    const today = dayjs();
    if (date.isSame(today, 'day')) {
      return date.fromNow();
    }
    else {
      return date.format("MMM D, YYYY h:mm A");
    }
  };

  const onSubmit = (data: MessageFormValues) => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    if (chatSocket) {
      const payload = {
        senderId,
        recipientId,
      };
      chatSocket.emit(chatEvents.stopTyping, payload);
    }

    messageSender(data.message);
    reset();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chats, typingStatus]);

  const messageStatusIndicator = (status: string) => {
    if (status === "sent") return <Check className="text-[12px] h-[12px] w-[12px]" />
    if (status === 'delivered') return <CheckCheck className="text-blue-500 text-[12px] h-[12px] w-[12px]" />
    if (status === 'read') return <CircleCheck className="text-green-500 text-[12px] h-[12px] w-[12px]" />
    if (status === 'failed') return <CircleAlert className="text-red-500 text-[12px] h-[12px] w-[12px]" />
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto h-[75vh]">
        {
          chats.map((messages: IMessage) => (
            <div key={messages.timestamp}>
              {
                messages.recipientId === userOnArea ?
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-end">
                      <p className="text-xs text-slate-500 mt-10">{messageStatusIndicator(messages.status)}</p>
                      <p className="text-right m-2 p-2 max-w-[300px] bg-slate-500 shadow-sm shadow-slate-600 rounded-xl text-white" >{messages.content}</p>
                    </div>
                    <p className="text-right text-xs text-slate-500">{formatTimeAgo(messages.timestamp)}</p>
                  </div>
                  :
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-start">
                      <img src={sender.profileImage ?? "placeholder.jpg"} className="w-10 h-12 rounded-full mt-1" />
                      <p className="text-left m-2 p-2 max-w-[40%] bg-gradient-to-br from-[#0099DB] to-[#00F0E4] text-black rounded-xl">{messages.content}</p>
                    </div>
                    <p className="text-left text-xs text-slate-500">{formatTimeAgo(messages.timestamp)}</p>
                  </div>
              }
            </div>
          ))
        }
        {typingStatus && <ChatTypingStatus />}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex flex-row mt-2" onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" {...register("message")} />
        <Button type="submit"><SendHorizonal /></Button>
      </form>
    </div>
  )
}