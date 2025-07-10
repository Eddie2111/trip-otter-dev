import { authOptions } from "@/auth";
import { PersonPage } from "@/components/person-page"
import { getServerSession } from "next-auth";

interface PersonPageProps {
  params: {
    id: string
  }
}

export default async function Person({ params }: PersonPageProps) {
  let personId: string;
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if(id === "me") {
    personId = session?.user?.id as string;
  } else {
    personId = id;
  }
  return <PersonPage personId={personId} selfProfile={id==="me" ? true : false}/>
}
