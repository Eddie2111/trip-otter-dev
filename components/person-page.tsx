"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  LinkIcon,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DesktopSidebar } from "./desktop-sidebar"
import { UserDocument } from "@/types/user"
import { Loading } from "./ui/loading"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
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

import {
  personData,
  highlights,
  mutualFollowers,
  mockFollowers,
} from "@/data/mocks/person.mock";

import { CreatePost } from "./create-post"
import GridMedia from "./grid-media"
import { useCommentApi, useLikeApi } from "@/lib/requests"
import { PostContainer } from "./post-card"

export function PersonPage({ personId, selfProfile }: PersonPageProps) {
  const [currentPage, setCurrentPage] = useState<"feed" | "chat" | "shops" | "shop" | "product" | "groups" | "group" | "people" | "person" | "settings">("person")
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [_personData, _setPersonData] = useState<UserDocument | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);
  const person = personData[personId as keyof typeof personData] || personData[1]
  // console.log(selfProfile);

  const [comment, setComment] = useState("");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Comment submitted:", comment);
    const response = await useCommentApi.createComment(
      posts[0]._id,
      comment,
    )
    // console.log(response);
    setComment(""); // Clear the input after submission
  };

  const handleLike = async (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    try {
      const postLike = await useLikeApi.likePost(postId);
      // console.log("Like response:", postId, postLike);
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }
  useEffect(() => {
    async function fetchProfile() {
      if (!_personData) {
        const response = await fetch(`/api/users?id=${personId}`);
        const user = await response.json();
        _setPersonData(user.data);
        setPosts(user.data.profile.posts);
        // console.log(user.data.profile.posts);
      }
    }
    if (!_personData) {
      fetchProfile();
    }
  }, [personId]);

  if (!_personData) {
    return <Loading />
  }
  return (
    <div className="flex min-h-screen">
      <DesktopSidebar
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
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
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-400 to-pink-400">
            <Image
              src={_personData?.coverImage || "/placeholder.svg"}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="bg-white px-4 pb-6 mt-0 md:mt-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
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
                    <span>
                      <strong>{0}</strong> followers
                    </span>
                    <span>
                      <strong>{0}</strong> following
                    </span>
                    <span>
                      <strong>{posts?.length}</strong> posts
                    </span>
                  </div>
                </div>
              </div>

              {selfProfile ? (
                <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
                  <Button variant="default" className="w-full md:w-auto">
                    Edit profile
                  </Button>
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
              <p className="whitespace-pre-line text-gray-800">
                {_personData?.bio}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {person.location}
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={`https://${person.website}`}
                    className="text-blue-600 hover:underline"
                  >
                    {person.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {_personData?.createdAt.toString().split("T")[0]}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{_personData?.role}</Badge>
                {mutualFollowers.length > 0 && (
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
                )}
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

            {/* Highlights */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Highlights</h3>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-2">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="flex flex-col items-center gap-2 min-w-0"
                    >
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-2 border-gray-200">
                          <AvatarImage
                            src={highlight.cover || "/placeholder.svg"}
                          />
                          <AvatarFallback>{highlight.title[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {highlight.count}
                        </div>
                      </div>
                      <span className="text-xs text-center truncate w-16">
                        {highlight.title}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
              <PostContainer userId={ personId } />
            </TabsContent>

            <TabsContent value="followers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Followers ({person.followers.toLocaleString()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFollowers.map((follower) => (
                      <div
                        key={follower.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={follower.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{follower.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {follower.name}
                              </span>
                              {follower.isVerified && (
                                <Star className="w-4 h-4 text-blue-500 fill-current" />
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              @{follower.username}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Following ({person.following.toLocaleString()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFollowers.map((following) => (
                      <div
                        key={following.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={following.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{following.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {following.name}
                              </span>
                              {following.isVerified && (
                                <Star className="w-4 h-4 text-blue-500 fill-current" />
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              @{following.username}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Following
                        </Button>
                      </div>
                    ))}
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
