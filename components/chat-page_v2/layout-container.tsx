"use client";
import { useSearchParams } from 'next/navigation';
import { $userLayout } from './chat.store';
import { useEffect } from 'react';

export function ChatLayoutContainer({children}: {children: React.ReactNode}) {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
    useEffect(() => {
    if (userId) {
      $userLayout.set(userId);
      console.log(`Setting userLayout to: ${userId}`);
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