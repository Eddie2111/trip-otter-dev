"use client";

import { useCompanionAPI } from "@/lib/requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, AlertTriangle } from "lucide-react";
import { FollowButton } from "@/components/follow-button";

const NUMBER_OF_PROFILES = 10;

export default function CompanionPage() {
  const { data: session } = useSession();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["homeFeed"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await useCompanionAPI.getCompanions(
        session?.user?.id as string,
        pageParam as number,
        NUMBER_OF_PROFILES
      );
      if (response.status !== 200) {
        throw new Error(response.message || "Failed to fetch feed.");
      }
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < NUMBER_OF_PROFILES) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-full p-4 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // Get all users from all pages and flatten the array
  const allSuggestedUsers = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="flex flex-col p-4 md:mx-20 mx-auto">
      <h2 className="font-bold text-2xl mb-4">Companions Around You</h2>
      <div className="flex flex-col space-y-4">
        {allSuggestedUsers.length > 0 ? (
          allSuggestedUsers.map((profile) => (
            <Card key={profile._id} className="flex flex-col max-w-[625px] max-h-[325px]">
              <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.user?.profileImage} />
                  <AvatarFallback>
                    {profile.user?.fullName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {profile.user?.fullName}
                  </CardTitle>
                  <CardDescription>@{profile.user?.username}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {profile.user?.bio || profile.user?.location}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <FollowButton
                  targetUserId={profile.user._id}
                  initialIsFollowing={false}
                />
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No suggested users found.</p>
        )}
      </div>

      {/* "Load More" button for infinite scrolling */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
