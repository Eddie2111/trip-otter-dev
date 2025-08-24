import { TribesPage_V1 } from "@/components/tribes-page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "Tribes",
      default: "Tribes",
    },
    description: "Tribes of TripOtter",
  };
}

export default function Tribes() {
  return (
    <div className="md:ml-[250px]">

      <TribesPage_V1 />
    </div>
  );
}
