"use client";

import { PostCard } from "@/components/post-card";
import { useSession } from "next-auth/react";

export default function PostPage({ postData }: { postData: any }) {
  const { data: session } = useSession();
  return (
    <div className="md:ml-[300px] mx-10">
      <PostCard key={postData._id} post={postData} session={session} />
    </div>
  );
}
