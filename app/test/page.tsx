"use client";
import { TribeMemberButton } from "@/components/tribe-page/tribe-member-button";

export default function Test() {
  return (
    <div className="md:ml-[300px] mx-auto p-4 sm:p-6 lg:p-8 font-inter bg-gray-50 min-h-screen dark:bg-slate-700">
      <div>
        <TribeMemberButton tribeId={"6922bd91-32ff-4511-b5a5-984e49831c55"}/>
      </div>
    </div>
  );
}