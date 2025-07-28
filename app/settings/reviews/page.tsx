import Link from "next/link";
import ReviewContainer from "./_component";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reviews() {
  return (
    <div className="ml-[300px]">
      <Link href="/settings">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>
      </Link>
      <ReviewContainer />
    </div>
  );
}
