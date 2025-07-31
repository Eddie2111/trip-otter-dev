"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Camera,
} from "lucide-react";
import { SearchModal } from "./search-modal";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { suggestedUsers } from "@/data/mocks/feed.mock";
import { useRouter } from "next/navigation";
import { DesktopHeader } from "./desktop-header";
import { PostContainer } from "./post-card_v2";
import { Sidebar } from "./mobile-sidebar";
import { LoadingScreen } from "./ui/loading-splash";
import MobileHeader from "./mobile-header";

export function TripotterFeed() {
  const router = useRouter();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (status === 'authenticated') {
        const _userData = await fetch(`api/users?id=${session?.user?.id}`);
        const data = await _userData.json();
        setUserData(data);
      }
    }
    fetchData();
  }, [status, session?.user?.id]);

  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
      toast.success("Come back soon!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout. Please try again.");
    }
  };

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="flex">
        {/* Main Content - Now only renders the feed content directly */}
        <div className="flex-1 md:ml-64">
          <div className="max-w-6xl mx-auto flex gap-8 px-4 md:px-8 py-0 md:py-8">
            {/* Feed */}

            <div className="flex-1 max-w-none md:max-w-lg">
              {/* Stories */}
              {/* <Card className="mb-6 bg-white dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-2">
                      {stories.map((story) => (
                        <div
                          key={story.id}
                          className="flex flex-col items-center gap-1 min-w-0"
                        >
                          <div
                            className={`relative ${
                              story.hasStory && !story.isOwn
                                ? "bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 rounded-full"
                                : ""
                            }`}
                          >
                            <Avatar
                              className={`w-14 h-14 ${
                                story.hasStory && !story.isOwn
                                  ? "border-2 border-white dark:border-gray-800"
                                  : ""
                              }`}
                            >
                              <AvatarImage
                                src={story.avatar || "/placeholder.svg"}
                                alt={story.username}
                              />
                              <AvatarFallback className="dark:bg-gray-700 dark:text-gray-300">
                                {story.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {story.isOwn && (
                              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 dark:bg-blue-700">
                                <PlusSquare className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center truncate w-16 text-gray-700 dark:text-gray-300">
                            {story.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card> */}

              {/* Posts */}
              <PostContainer/> {/* Pass profileId */}
            </div>

            {/* Right Sidebar - Suggested Users */}
            <div className="hidden lg:block w-80 space-y-6">
              <Card className="p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-500 dark:text-gray-300">
                    Suggested for you
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    See All
                  </Button>
                </div>
                <div className="space-y-3">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="dark:bg-gray-700 dark:text-gray-300">
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Followed by {user.mutualFollowers} others
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 text-xs font-semibold dark:text-blue-400 dark:hover:bg-gray-700"
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="text-xs text-gray-400 space-y-1 dark:text-gray-500">
                <div>About • Help • Press • API • Jobs • Privacy • Terms</div>
                <div>Locations • Language </div>
                <div className="mt-4">© 2025 Tripotter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
