"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { PostContainer } from "./post-card_v2";

import { LoadingScreen } from "./ui/loading-splash";
import { SuggestedUsers } from "./suggestedUsers";
import Link from "next/link";


export function TripotterFeed() {
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

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
                  <Link
                    href="/companions"
                    className="text-xs font-semibold text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:underline"
                  >
                    See All
                  </Link>
                </div>
                <div className="space-y-3">
                  <SuggestedUsers />
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
