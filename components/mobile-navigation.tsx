"use client";
import { useState } from "react";
import { Home, PlusSquare, Search, Heart, User } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { CreatePost } from "./create-post";

export function MobileNavigation({ profileId }: { profileId: any }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    | "feed"
    | "chat"
    | "shops"
    | "shop"
    | "product"
    | "groups"
    | "group"
    | "people"
    | "person"
    | "settings"
  >("feed");
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex items-center justify-around py-2">
        <Button
          variant="ghost"
          size="icon"
          className={currentPage === "feed" ? "text-black" : "text-gray-400"}
          onClick={() => router.push("/")}
        >
          <Home className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400"
          onClick={() => router.push("/tripeasy")}
        >
          <Search className="w-6 h-6" />
        </Button>
        <CreatePost profileId={profileId}>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <PlusSquare className="w-6 h-6" />
          </Button>
        </CreatePost>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400"
          onClick={() => router.push("/person/likes")}
        >
          <Heart className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400"
          onClick={() => router.push("/person/me")}
        >
          <User className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
