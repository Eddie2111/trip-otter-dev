import { GroupPage } from "@/components/group-page";

interface GroupPageProps {
  params: {
    id: string;
  };
}

/* generate meta data when needed, scraped from /posts/[id] page

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  let title = "Group";

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
*/

export default async function GroupsPage({ params }: GroupPageProps) {
    const groupId = await params;
    return <GroupPage groupId={groupId.id} />;
}
