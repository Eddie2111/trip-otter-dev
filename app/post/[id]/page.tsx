import { PostCard } from "@/components/post-card";
import GetPost from "./action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);
  try {
    const postData = await GetPost(id);
    const { data: session } = await getServerSession(authOptions);
    if (postData) {
      return (
        <div>
          <h1>Post</h1>
          <PostCard key={postData._id} post={postData} session={session} />
        </div>
      );
    } else {
      return (
        <div>
          <h1>Post not found</h1>
        </div>
      );
    }
    
  } catch (error) {
    // console.log(error);
  }
}
