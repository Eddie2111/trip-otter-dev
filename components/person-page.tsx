"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  LinkIcon,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import Dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { DesktopSidebar } from "./desktop-sidebar";
import type { UserDocument, IUserProfile } from "@/types/user";
import { Loading, LoadingSmall } from "./ui/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { useSession } from "next-auth/react";

import { useFollowApi, useUserApi } from "@/lib/requests";
import { PostContainer } from "./post-card";
import { ProfileEditModal } from "./profile-page/profile-edit-modal";
import { ProfileEditImages } from "./profile-page/profile-edit-images";
import { FollowModal } from "./follow-modal";
import { useWebsocket } from "@/lib/useWebsocket";

import { PersonPageProps, IPost } from "@/types/person";

const CreatePost = Dynamic(
  () => import("./create-post").then((mod) => mod.CreatePost),
  {
    ssr: true,
    loading: () => <LoadingSmall />,
  }
);

export function PersonPage({ personId, selfProfile }: PersonPageProps) {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const currentLoggedInUserId = session?.user?.id;
  const [activeTab, setActiveTab] = useState("posts");

  // TanStack Query for User Profile Data
  const {
    data: personProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery<IUserProfile, Error>({
    queryKey: ["user", personId],
    queryFn: async () => {
      const response = await fetch(`/api/users?id=${personId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const user = await response.json();
      return user.data;
    },
    // Query is enabled only when personId is available AND session is loaded (not 'loading')
    enabled: !!personId && sessionStatus !== "loading",
    staleTime: 1000 * 60 * 5, // Data considered stale after 5 minutes
  });

  // Derive states from personProfile (TanStack Query data)
  const _personData = personProfile;
  const posts = _personData?.profile?.posts || [];
  const followersCount = _personData?.profile?.followersCount || 0;
  const followingCount = _personData?.profile?.followingCount || 0;

  // Determine if the current user is following this profile
  const isFollowingInitial =
    currentLoggedInUserId &&
    _personData?.profile?.followers?.includes(currentLoggedInUserId);
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);

  // Update isFollowing state when personProfile changes
  useEffect(() => {
    if (_personData) {
      const followerIds = Array.isArray(_personData.profile.followers)
        ? _personData.profile.followers.map((f: any) => f._id || f)
        : _personData.profile.followers;
      setIsFollowing(followerIds?.includes(currentLoggedInUserId) || false);
    }
  }, [_personData, currentLoggedInUserId]);

  // Websocket connection
  const [isConnected, setIsConnected] = useState(false);
  const socket = useWebsocket({
    path: "/notification",
    shouldAuthenticate: true,
    autoConnect: true,
  });

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const createNotification = async () => {
    const getUser = await useUserApi.getUser(session?.user?.id ?? "");
    if (isConnected) {
      socket.emit("createNotification", {
        createdBy: getUser?.data?.profile?._id,
        receiver: _personData?._id ?? "",
        content: "followed you",
        type: "FOLLOW",
        postUrl: `/person/${getUser?.data?.profile?._id ?? ""}`,
        isRead: false,
      });
    }
  };

  // TanStack Query for Follow/Unfollow Mutation
  const followMutation = useMutation<
    any, // Expected response data type
    Error, // Error type
    string, // Variable type passed to mutationFn (personId to follow/unfollow)
    { previousIsFollowing: boolean; previousFollowersCount: number } // Context type for onMutate
  >({
    mutationFn: async (targetPersonId) => {
      const response = await useFollowApi.toggleFollow(targetPersonId);
      return response.data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["user", personId] });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData<IUserProfile>([
        "user",
        personId,
      ]);

      // Optimistically update the UI
      if (previousProfile) {
        const newFollowersCount = isFollowing
          ? previousProfile.profile.followersCount - 1
          : previousProfile.profile.followersCount + 1;

        // Update the cached data directly
        queryClient.setQueryData<IUserProfile>(["user", personId], (old) => {
          if (!old) return old;
          const newFollowers = isFollowing
            ? old.profile.followers.filter(
                (f: any) => (f._id || f) !== currentLoggedInUserId
              )
            : [...old.profile.followers, currentLoggedInUserId];

          return {
            ...old,
            profile: {
              ...old.profile,
              followersCount: newFollowersCount,
              followers: newFollowers,
            },
          };
        });
        setIsFollowing((prev) => !prev);
      }

      // Return a context object with the snapshotted value
      return {
        previousIsFollowing: isFollowing,
        previousFollowersCount: followersCount,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", personId] });
      createNotification();
    },
    onError: (err, variables, context) => {
      console.error("Error toggling follow:", err);
      // If the mutation fails, use the context to roll back the optimistic update
      if (context?.previousIsFollowing !== undefined) {
        setIsFollowing(context.previousIsFollowing);
        // Revert the cached data
        queryClient.setQueryData<IUserProfile>(["user", personId], (old) => {
          if (!old) return old;
          const revertedFollowers = context.previousIsFollowing
            ? [...old.profile.followers, currentLoggedInUserId]
            : old.profile.followers.filter(
                (f: any) => (f._id || f) !== currentLoggedInUserId
              );

          return {
            ...old,
            profile: {
              ...old.profile,
              followersCount: context.previousFollowersCount,
              followers: revertedFollowers,
            },
          };
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure the client state is
      // synchronized with the server state.
      queryClient.invalidateQueries({ queryKey: ["user", personId] });
    },
  });

  const handleFollow = () => {
    if (!_personData?._id) {
      console.error("Person data not loaded yet.");
      return;
    }
    followMutation.mutate(_personData._id);
  };

  // TanStack Query for Followers/Following Lists (Conditional Fetching)
  const { data: followersList = [], isLoading: isFollowersLoading } = useQuery<
    UserDocument[],
    Error
  >({
    queryKey: ["followersList", _personData?._id],
    queryFn: async () => {
      if (!_personData?._id) return [];
      const response = await useFollowApi.getFollowersOrFollowing(
        _personData._id,
        "followers"
      );
      return response.data;
    },
    enabled: activeTab === "followers" && !!_personData?._id,
    staleTime: 1000 * 60 * 1, // Cache followers for 1 minute
  });

  const { data: followingList = [], isLoading: isFollowingLoading } = useQuery<
    UserDocument[],
    Error
  >({
    queryKey: ["followingList", _personData?._id],
    queryFn: async () => {
      if (!_personData?._id) return [];
      const response = await useFollowApi.getFollowersOrFollowing(
        _personData._id,
        "following"
      );
      return response.data;
    },
    enabled: activeTab === "following" && !!_personData?._id,
    staleTime: 1000 * 60 * 1, // Cache following for 1 minute
  });

  // Display loading state for the main profile
  // Show loading if session is still loading OR if profile query is loading
  if (sessionStatus === "loading" || isProfileLoading) {
    return <Loading />;
  }

  // Display error state for the main profile
  if (isProfileError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading profile: {profileError?.message}
        </p>
      </div>
    );
  }

  // If data is still null after loading and no error, it means user not found.
  if (!personProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  const displayPersonData = personProfile;

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="md:ml-64 flex-1 bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Link href="/" shallow={true}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">{displayPersonData?.fullName}</h1>
                <p className="text-sm text-gray-500">{posts?.length} posts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-400 to-pink-400 group">
            <Image
              src={displayPersonData?.coverImage || "/placeholder.svg"}
              alt="Cover"
              fill
              className="object-cover"
            />
            {selfProfile && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ProfileEditImages type="COVER">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Edit Cover Photo
                  </Button>
                </ProfileEditImages>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-white px-4 pb-6 mt-0 md:mt-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={
                        displayPersonData?.profileImage || "/placeholder.svg"
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {displayPersonData?.fullName
                        ? displayPersonData?.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "Test"
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selfProfile && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ProfileEditImages type="PROFILE">
                        <Button variant="secondary" size="icon">
                          <Camera className="w-5 h-5" />
                        </Button>
                      </ProfileEditImages>
                    </div>
                  )}
                </div>

                <div className="md:mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">
                      {displayPersonData?.fullName}
                    </h1>
                    {displayPersonData.verified && (
                      <Star className="w-5 h-5 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    @{displayPersonData?.username}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <FollowModal
                      type="Followers"
                      userId={displayPersonData._id ?? ""}
                    >
                      <span className="underline">
                        <strong>{followersCount}</strong> followers
                      </span>
                    </FollowModal>
                    <FollowModal
                      type="Following"
                      userId={displayPersonData._id ?? ""}
                    >
                      <span className="underline">
                        <strong>{followingCount}</strong> following
                      </span>
                    </FollowModal>
                    <span>
                      <strong>{posts?.length}</strong> posts
                    </span>
                  </div>
                </div>
              </div>

              {selfProfile ? (
                <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
                  <ProfileEditModal
                    type="FULLFORM"
                    defaultData={displayPersonData}
                  >
                    <Button variant="default" className="w-full md:w-auto">
                      Edit profile
                    </Button>
                  </ProfileEditModal>
                  <CreatePost profileId={personId}>
                    <Button variant="default" className="w-full md:w-auto">
                      Create post
                    </Button>
                  </CreatePost>
                </div>
              ) : (
                <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                    className="flex-1 md:flex-none"
                    disabled={followMutation.isPending}
                  >
                    {followMutation.isPending ? (
                      <LoadingSmall />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isFollowing ? "Following" : "Follow"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Bio and Info */}
            <div className="mt-4 space-y-3">
              <div className="whitespace-pre-line text-gray-800">
                {displayPersonData?.bio ? (
                  displayPersonData?.bio
                ) : (
                  <ProfileEditModal type="BIO" defaultData={displayPersonData}>
                    <Badge variant="secondary">+ Add bio</Badge>
                  </ProfileEditModal>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {displayPersonData.location ? (
                    displayPersonData.location
                  ) : (
                    <ProfileEditModal
                      type="LOCATION"
                      defaultData={displayPersonData}
                    >
                      <Badge>+ Add Location</Badge>
                    </ProfileEditModal>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {displayPersonData.socials ? (
                    displayPersonData.socials.map((social, index) => {
                      return (
                        <div className="flex flex-row gap-1" key={index}>
                          <LinkIcon className="w-4 h-4" />
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 transition ease-in-out duration-300 hover:underline"
                          >
                            <span className="text-gray-600">
                              {social.platform}
                            </span>
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <ProfileEditModal
                      type="SOCIALS"
                      defaultData={displayPersonData}
                    >
                      <Badge variant="secondary">+ Add socials</Badge>
                    </ProfileEditModal>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined{" "}
                  {displayPersonData?.createdAt?.toString().split("T")[0]}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{displayPersonData?.role}</Badge>
                {/* {mutualFollowers.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>Followed by</span>
                    <div className="flex -space-x-1">
                      {mutualFollowers.slice(0, 3).map((follower, index) => (
                        <Avatar
                          key={index}
                          className="w-5 h-5 border border-white"
                        >
                          <AvatarImage
                            src={follower.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {follower.username[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span>and {mutualFollowers.length} others you follow</span>
                  </div>
                )} */}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-lg">
                    {displayPersonData.stats?.totalLikes || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {displayPersonData.stats?.avgLikes || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Likes</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {displayPersonData.stats?.engagement || 0}
                  </div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <PostContainer profileId={displayPersonData._id} />
            </TabsContent>

            <TabsContent value="followers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Followers ({followersCount.toLocaleString()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isFollowersLoading ? (
                      <LoadingSmall />
                    ) : followersList.length > 0 ? (
                      followersList.map((follower) => (
                        <div
                          key={follower._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Link href={`/person/${follower._id}`}>
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={
                                    follower.profileImage || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {follower.fullName
                                    ? follower.fullName[0]
                                    : follower.username[0]}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link href={`/person/${follower._id}`}>
                                  <span className="font-semibold">
                                    {follower.fullName}
                                  </span>
                                </Link>
                              </div>
                              <Link href={`/person/${follower._id}`}>
                                <span className="text-sm text-gray-600">
                                  @{follower.username}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No followers yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Following ({followingCount.toLocaleString()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isFollowingLoading ? (
                      <LoadingSmall />
                    ) : followingList.length > 0 ? (
                      followingList.map((following) => (
                        <div
                          key={following._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Link href={`/person/${following._id}`}>
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={
                                    following.profileImage || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {following.fullName
                                    ? following.fullName[0]
                                    : following.username[0]}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link href={`/person/${following._id}`}>
                                  <span className="font-semibold">
                                    {following.fullName}
                                  </span>
                                </Link>
                              </div>
                              <Link href={`/person/${following._id}`}>
                                <span className="text-sm text-gray-600">
                                  @{following.username}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Not following anyone yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
