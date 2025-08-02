import { GroupsPage } from "@/components/groups-page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "Groups",
      default: "Groups",
    },
    description: "Groups of TripOtter",
  };
}

export default function Shop() {
  return (
    <div className="mx-10 md:ml-[250px]">
      <GroupsPage />
    </div>
  );
}
