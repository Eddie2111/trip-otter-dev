"use client";
import { TripotterFeed } from "@/components/tripotter-feed"
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
export default function Home() {
  return (
    <SessionProvider>
    <div className="min-h-screen bg-white">
      <Toaster />
      <TripotterFeed />
    </div>
    </SessionProvider>
  )
}
