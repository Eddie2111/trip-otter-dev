import GetPost from "./action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dynamic from "next/dynamic";
import { Loading } from "@/components/ui/loading";

const PostCard = dynamic(
  () => import("@/components/post-card").then((mod) => mod.PostCard),
  {
    loading: () => <Loading />,
  }
);

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    // console.log(error);
  }
}
