"use client";
import { useSearchParams } from 'next/navigation';
import { $userLayout } from './chat.store';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatEvents } from './constants/events';

export function ChatLayoutContainer({children}: {children: React.ReactNode}) {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
  const queryClient = useQueryClient();
    useEffect(() => {
    if (userId) {
      $userLayout.set(userId);
      console.log(`Setting userLayout to: ${userId}`);
      queryClient.invalidateQueries({ queryKey: ["UserChatData", userId] });
    } else {
      $userLayout.set('');
    }
  }, [userId]);
  return (
    <div className="flex flex-row border-2 border-blue-500">
      {children}
    </div>
  )
}