"use client";

import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { FeedbackFormContainer } from "@/components/feedback-container";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextNProgress
          color="#38f2d0"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          options={{ easing: "ease", speed: 500, showSpinner: true }}
        />
        {children}
        <FeedbackFormContainer />
      </QueryClientProvider>
    </SessionProvider>
  );
}
