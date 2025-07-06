"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  LinkIcon,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Heart,
  Grid3X3,
  Play,
  Tag,
} from "lucide-react"
import Image from "next/image"

interface PersonPageProps {
  personId: number
  onBack: () => void
}

const personData = {
  1: {
    username: "alex_wanderer",
    name: "Alex Thompson",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=200&width=800",
    followers: "125K",
    following: "892",
    posts: "1.2K",
    bio: "Travel photographer & storyteller 📸\nCurrently exploring the hidden gems of Southeast Asia 🌴\nSharing stories one frame at a time ✨",
    location: "Bali, Indonesia",
    website: "alexwanderer.com",
    joinDate: "March 2020",
    verified: true,
    category: "Travel",
    isFollowing: false,
    stats: {
      totalLikes: "2.5M",
      avgLikes: "2.1K",
      engagement: "8.5%",
    },
  },
}

const posts = [
  {
    id: 1,
    image: "/placeholder.svg?height=400&width=400",
    likes: 2156,
    comments: 89,
    caption:
      "Golden hour magic in the rice terraces of Bali 🌅 Sometimes the best moments happen when you least expect them.",
    timeAgo: "2 hours ago",
    location: "Jatiluwih, Bali",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1834,
    comments: 67,
    caption: "Street food adventures in Bangkok! This pad thai changed my life 🍜 #StreetFood #Bangkok",
    timeAgo: "1 day ago",
    location: "Bangkok, Thailand",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=400&width=400",
    likes: 3421,
    comments: 156,
    caption: "Sunrise from Mount Batur was absolutely breathtaking! Worth every step of the 4am hike 🏔️",
    timeAgo: "3 days ago",
    location: "Mount Batur, Bali",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1567,
    comments: 43,
    caption: "Local fishermen at work during blue hour. Their dedication is truly inspiring 🎣",
    timeAgo: "5 days ago",
    location: "Sanur Beach, Bali",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=400&width=400",
    likes: 2890,
    comments: 112,
    caption: "Hidden waterfall discovered during today's jungle trek! Nature never ceases to amaze me 💚",
    timeAgo: "1 week ago",
    location: "Sekumpul Falls, Bali",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1245,
    comments: 34,
    caption: "Traditional Balinese ceremony at the local temple. Such rich culture and beautiful traditions 🙏",
    timeAgo: "1 week ago",
    location: "Tanah Lot, Bali",
  },
]

const highlights = [
  { id: 1, title: "Bali Adventures", cover: "/placeholder.svg?height=80&width=80", count: 12 },
  { id: 2, title: "Street Food", cover: "/placeholder.svg?height=80&width=80", count: 8 },
  { id: 3, title: "Sunrises", cover: "/placeholder.svg?height=80&width=80", count: 15 },
  { id: 4, title: "Local Culture", cover: "/placeholder.svg?height=80&width=80", count: 6 },
]

const mutualFollowers = [
  { username: "sarah_explorer", avatar: "/placeholder.svg?height=32&width=32" },
  { username: "mike_photographer", avatar: "/placeholder.svg?height=32&width=32" },
  { username: "emma_foodie", avatar: "/placeholder.svg?height=32&width=32" },
]

export function PersonPage({ personId, onBack }: PersonPageProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  const person = personData[personId as keyof typeof personData] || personData[1]

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{person.name}</h1>
              <p className="text-sm text-gray-500">{person.posts} posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-400 to-pink-400">
          <Image src={person.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        </div>

        {/* Profile Info */}
        <div className="bg-white px-4 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={person.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="md:mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{person.name}</h1>
                  {person.verified && <Star className="w-5 h-5 text-blue-500 fill-current" />}
                </div>
                <p className="text-gray-600 mb-1">@{person.username}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>
                    <strong>{person.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{person.following}</strong> following
                  </span>
                  <span>
                    <strong>{person.posts}</strong> posts
                  </span>
                </div>
              </div>
            </div>

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
          </div>

          {/* Bio and Info */}
          <div className="mt-4 space-y-3">
            <p className="whitespace-pre-line text-gray-800">{person.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {person.location}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href={`https://${person.website}`} className="text-blue-600 hover:underline">
                  {person.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {person.joinDate}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{person.category}</Badge>
              {mutualFollowers.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>Followed by</span>
                  <div className="flex -space-x-1">
                    {mutualFollowers.slice(0, 3).map((follower, index) => (
                      <Avatar key={index} className="w-5 h-5 border border-white">
                        <AvatarImage src={follower.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{follower.username[0]}</AvatarFallback>
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
                <div className="font-semibold text-lg">{person.stats.totalLikes}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{person.stats.avgLikes}</div>
                <div className="text-sm text-gray-600">Avg. Likes</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{person.stats.engagement}</div>
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
                  <div key={highlight.id} className="flex flex-col items-center gap-2 min-w-0">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-gray-200">
                        <AvatarImage src={highlight.cover || "/placeholder.svg"} />
                        <AvatarFallback>{highlight.title[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {highlight.count}
                      </div>
                    </div>
                    <span className="text-xs text-center truncate w-16">{highlight.title}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white border-t">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="posts"
                className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                <Grid3X3 className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="reels"
                className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                <Play className="w-4 h-4" />
                Reels
              </TabsTrigger>
              <TabsTrigger
                value="tagged"
                className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                <Tag className="w-4 h-4" />
                Tagged
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {posts.map((post) => (
                  <div key={post.id} className="relative aspect-square group cursor-pointer">
                    <Image src={post.image || "/placeholder.svg"} alt="Post" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reels" className="mt-0">
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="relative aspect-square group cursor-pointer">
                    <Image src={post.image || "/placeholder.svg"} alt="Reel" fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tagged" className="mt-0">
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {posts.slice(2, 5).map((post) => (
                  <div key={post.id} className="relative aspect-square group cursor-pointer">
                    <Image src={post.image || "/placeholder.svg"} alt="Tagged post" fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
