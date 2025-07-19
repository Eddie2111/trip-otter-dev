"use client";
import { useEffect, useState } from "react";
import type React from "react";

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
import Image from "next/image";
import Link from "next/link";
import { DesktopSidebar } from "./desktop-sidebar";
import type { UserDocument } from "@/types/user";
import { Loading } from "./ui/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Import useSession for client-side authentication
import { useSession } from "next-auth/react";

interface PersonPageProps {
  personId: string;
  selfProfile: boolean;
}

interface IPost {
  _id: string;
  image: string[];
  likes: Array<{
    _id: string;
    fullName: string;
    username: string;
  }>;
  caption: string;
  location: string;
  owner: string;
  comments: Array<{
    _id: string;
    content: string;
    owner: {
      _id: string;
      username: string;
    };
    createdAt: string;
  }>;
  serial: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

import { personData } from "@/data/mocks/person.mock"; // Keep mock data if still used elsewhere
import { CreatePost } from "./create-post";
import { useCommentApi, useLikeApi, useFollowApi } from "@/lib/requests";
import { PostContainer } from "./post-card";
import { ProfileEditModal } from "./profile-page/profile-edit-modal";
import { ProfileEditImages } from "./profile-page/profile-edit-images";
import { FollowModal } from "./follow-modal";

export function PersonPage({ personId, selfProfile }: PersonPageProps) {
  const { data: session } = useSession(); // Get logged-in user session
  const currentLoggedInUserId = session?.user?.id; // Get logged-in user ID

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
  >("person");
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [_personData, _setPersonData] = useState<UserDocument | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);
  const [followersList, setFollowersList] = useState<UserDocument[]>([]);
  const [followingList, setFollowingList] = useState<UserDocument[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const person =
    personData[personId as keyof typeof personData] || personData[1]; // Keep for mock data if needed

  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure posts is not null and has at least one element before accessing posts[0]._id
    if (posts && posts.length > 0) {
      const response = await useCommentApi.createComment(posts[0]._id, comment);
      setComment("");
    } else {
      console.warn("Cannot submit comment: No posts available.");
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic update
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    try {
      const postLike = await useLikeApi.likePost(postId);
      // If API returns actual status, update based on that
      // For now, assuming optimistic update is sufficient or API confirms it.
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    }
  };

  const handleFollow = async () => {
    if (!_personData?._id) {
      console.error("Person data not loaded yet.");
      return;
    }

    // Optimistic update
    setIsFollowing((prev) => !prev);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));

    try {
      const response = await useFollowApi.toggleFollow(_personData._id);
      // Update state based on actual response from API
      setIsFollowing(response.data.isFollowing);
      setFollowersCount(response.data.followersCount);
      setFollowingCount(response.data.followingCount); // This is the logged-in user's following count
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert optimistic update on error
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
      // Potentially show an error message to the user
    }
  };

  // Effect to fetch initial profile data and determine initial follow status
  useEffect(() => {
    async function fetchProfileAndFollowStatus() {
      const response = await fetch(`/api/users?id=${personId}`);
      const user = await response.json();
      _setPersonData(user.data);
      setPosts(user.data.profile.posts);

      // Initialize counts from fetched profile data
      // Assuming user.data.profile.followers and following are arrays of IDs or populated User objects
      setFollowersCount(user.data.profile.followers?.length || 0);
      setFollowingCount(user.data.profile.following?.length || 0);

      // Determine initial isFollowing state for the logged-in user
      if (
        currentLoggedInUserId &&
        user.data.profile.followers &&
        Array.isArray(user.data.profile.followers)
      ) {
        // If followers are populated User objects, map to IDs for comparison
        const followerIds = user.data.profile.followers.map((f: any) => f._id);
        setIsFollowing(followerIds.includes(currentLoggedInUserId));
      } else if (
        currentLoggedInUserId &&
        user.data.profile.followers &&
        !Array.isArray(user.data.profile.followers)
      ) {
        // If followers is an array of just IDs (not populated)
        setIsFollowing(
          user.data.profile.followers.includes(currentLoggedInUserId)
        );
      } else {
        setIsFollowing(false);
      }
    }

    // Only fetch if _personData is null AND currentLoggedInUserId is available (for initial follow status check)
    // or if the personId changes
    if (!_personData && currentLoggedInUserId) {
      fetchProfileAndFollowStatus();
    }
  }, [personId, _personData, currentLoggedInUserId]); // Add currentLoggedInUserId to dependencies

  // Effect to fetch followers/following lists when tabs change
  useEffect(() => {
    async function fetchTabContent() {
      if (!_personData?._id) return; // Ensure person data is loaded

      if (activeTab === "followers") {
        try {
          const response = await useFollowApi.getFollowersOrFollowing(
            _personData._id,
            "followers"
          );
          setFollowersList(response.data);
        } catch (error) {
          console.error("Error fetching followers:", error);
          setFollowersList([]);
        }
      } else if (activeTab === "following") {
        try {
          const response = await useFollowApi.getFollowersOrFollowing(
            _personData._id,
            "following"
          );
          setFollowingList(response.data);
        } catch (error) {
          console.error("Error fetching following:", error);
          setFollowingList([]);
        }
      }
    }

    fetchTabContent();
  }, [activeTab, _personData?._id]); // Re-fetch when tab changes or person data loads

  if (!_personData) {
    return <Loading />;
  }

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
                <h1 className="font-semibold">{_personData?.fullName}</h1>
                <p className="text-sm text-gray-500">{posts?.length} posts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-400 to-pink-400 group">
            <Image
              src={_personData?.coverImage || "/placeholder.svg"}
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
                      src={_personData?.profileImage || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-2xl">
                      {_personData?.fullName ??
                        "Test"
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
                      {_personData?.fullName}
                    </h1>
                    {person.verified && (
                      <Star className="w-5 h-5 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">@{_personData?.username}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <FollowModal type="Followers" userId={_personData._id ?? ""}>
                      <span className="underline">
                        <strong>{followersCount}</strong> followers
                      </span>
                    </FollowModal>
                    <FollowModal type="Following" userId={_personData._id ?? ""}>
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
                  <ProfileEditModal type="FULLFORM" defaultData={_personData}>
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
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isFollowing ? "Following" : "Follow"}
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
                {_personData?.bio ? (
                  _personData?.bio
                ) : (
                  <ProfileEditModal type="BIO" defaultData={_personData}>
                    <Badge variant="secondary">+ Add bio</Badge>
                  </ProfileEditModal>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {_personData.location ? (
                    _personData.location
                  ) : (
                    <ProfileEditModal type="LOCATION" defaultData={_personData}>
                      <Badge>+ Add Location</Badge>
                    </ProfileEditModal>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {_personData.socials ? (
                    _personData.socials.map((social, index) => {
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
                    <ProfileEditModal type="SOCIALS" defaultData={_personData}>
                      <Badge variant="secondary">+ Add socials</Badge>
                    </ProfileEditModal>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {_personData?.createdAt.toString().split("T")[0]}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{_personData?.role}</Badge>
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
                    {person.stats.totalLikes}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {person.stats.avgLikes}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Likes</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {person.stats.engagement}
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
              <PostContainer userId={personId} />
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
                    {followersList.length > 0 ? (
                      followersList.map((follower) => (
                        <div
                          key={follower._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
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
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {follower.fullName}
                                </span>
                                {/* Assuming UserDocument has a verified field or similar */}
                                {/* {follower.isVerified && (
                                  <Star className="w-4 h-4 text-blue-500 fill-current" />
                                )} */}
                              </div>
                              <span className="text-sm text-gray-600">
                                @{follower.username}
                              </span>
                            </div>
                          </div>
                          {/* You might want to add a follow/unfollow button here as well,
                              checking if the current logged-in user is following this follower */}
                          {/* <Button variant="outline" size="sm">
                            Follow
                          </Button> */}
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
                    {followingList.length > 0 ? (
                      followingList.map((following) => (
                        <div
                          key={following._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
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
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {following.fullName}
                                </span>
                                {/* {following.isVerified && (
                                  <Star className="w-4 h-4 text-blue-500 fill-current" />
                                )} */}
                              </div>
                              <span className="text-sm text-gray-600">
                                @{following.username}
                              </span>
                            </div>
                          </div>
                          {/* <Button variant="outline" size="sm">
                            Following
                          </Button> */}
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
