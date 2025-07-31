import GetPost from "./action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dynamic from "next/dynamic";
import { Loading } from "@/components/ui/loading";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  let title = "Photo";

  try {
    const postData = await GetPost(id);
    if (postData && postData.caption) {
      const words = postData.caption.split(/\s+/).filter(Boolean);
      title = words.slice(0, 5).join(" ");
    }
  } catch (error) {
    console.error("Failed to fetch post data for metadata:", error);
  }
  return {
    title: title,
  };
}

const PostCard = dynamic(
  () => import("@/components/post-card").then((mod) => mod.PostCard),
  {
    loading: () => <Loading />,
  }
);

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  try {
    const postData = await GetPost(id);
    const { data: session } = await getServerSession(authOptions);
    if (postData) {
      return (
        <div className="md:ml-[300px] mx-10">
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
    console.error("Error fetching post data in Page component:", error);
    return (
      <div>
        <h1>Error loading post</h1>
      </div>
    );
  }
}
