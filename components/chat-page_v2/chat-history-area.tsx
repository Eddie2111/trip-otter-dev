"use client";

import { Input } from "../ui/input";
import { SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IMessage {
  content: string;
  recipientId: string;
  senderId: string;
  timestamp: number;
}

interface ICurrentChatHistoryProps {
  chats: IMessage[];
  messageSender: (message: string) => void;
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message is too long"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function CurrentChatHistory({ chats, messageSender }: ICurrentChatHistoryProps) {
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: MessageFormValues) => {
    messageSender(data.message);
    reset();
  };

  return (
    <div className="flex flex-col">
      {
        chats.map((messages: IMessage) => (
          <div key={messages.timestamp}>
            {messages.content}
          </div>
        )
        )
      }
      <form className="flex flex-row" onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" name="message" />
        <Button><SendHorizonal /></Button>
      </form>
    </div>
  )
}
