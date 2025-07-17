"use client";

import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <NextNProgress
        color="#38f2d0"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500, showSpinner: true }}
      />
      {children}
    </SessionProvider>
  );
}
