"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopSidebar } from "./desktop-sidebar";

export default function LayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  if (session?.user)
    return (
      <>
        <DesktopSidebar />
        {children}
        <MobileNavigation />
      </>
    );
  else {
    return <>{children}</>;
  }
}
