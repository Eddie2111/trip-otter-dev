import { authOptions } from "@/auth";
import { FollowModal } from "@/components/follow-modal";
import { LoadingScreen } from "@/components/ui/loading-splash";
import { getServerSession } from "next-auth";

export default async function Test() {
  const user = await getServerSession(authOptions);
  console.log(user); // @ts-ignore
  return (
    <>
      <LoadingScreen />
      <div className="ml-[32vw]">

      </div>
      <FollowModal type="Followers" users={[]} userId={user?.user?.id ?? ""}>
        <button> Followers</button>
      </FollowModal>
      <FollowModal type="Following" users={[]} userId={user?.user?.id ?? ""}>
        <button> Following</button>
      </FollowModal>
    </>
  );
}
