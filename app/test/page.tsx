"use client";
import CreateTribeForm from "@/components/tribes-page/create-tribe";

export default function Test() {
  return (
    <div className="md:ml-[300px] mx-auto p-4 sm:p-6 lg:p-8 font-inter bg-gray-50 min-h-screen">
      <div>
        <CreateTribeForm />
      </div>
    </div>
  );
}