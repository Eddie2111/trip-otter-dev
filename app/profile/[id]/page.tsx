import { authOptions } from "@/auth";
import { PersonPage } from "@/components/person-page";
import { getServerSession } from "next-auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  return <PersonPage personId={id}/>;
}
