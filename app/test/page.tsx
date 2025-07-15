"use client";
import { ReportModal } from "@/components/report-modal";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Test() { 
  const { data: session } = useSession();
  return (
    <div className="ml-[32vw]">
      <ReportModal
        reportedBy="123456"
        reportedUser="124346"
        relatedPostId="389rf34"
        relatedCommentId="9843fyhg84rf9"
      >
        <div className="border-0 text-black dark:text-white">Report </div>
      </ReportModal>
    </div>
    
  )
}