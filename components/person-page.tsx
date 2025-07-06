"use client"

import { useState } from "react"
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
  Heart,
  Send,
  Bookmark,
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
    comments: [
      { username: "sarah_explorer", text: "This is absolutely stunning! 😍" },
      { username: "mike_photographer", text: "Amazing composition!" },
    ],
    caption:
      "Golden hour magic in the rice terraces of Bali 🌅 Sometimes the best moments happen when you least expect them. This shot was completely unplanned - I was just walking back to my hotel when the light hit perfectly.",
    timeAgo: "2 hours ago",
    location: "Jatiluwih, Bali",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1834,
    comments: [
      { username: "foodie_emma", text: "I need this recipe! 🤤" },
      { username: "bangkok_local", text: "Best pad thai in the city!" },
    ],
    caption:
      "Street food adventures in Bangkok! This pad thai changed my life 🍜 The vendor has been perfecting this recipe for 30 years and you can taste every bit of that experience. #StreetFood #Bangkok",
    timeAgo: "1 day ago",
    location: "Bangkok, Thailand",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=400&width=400",
    likes: 3421,
    comments: [
      { username: "hiker_tom", text: "Worth the early wake up call!" },
      { username: "sunrise_chaser", text: "Incredible view! 🏔️" },
      { username: "bali_guide", text: "One of the best sunrise spots!" },
    ],
    caption:
      "Sunrise from Mount Batur was absolutely breathtaking! Worth every step of the 4am hike 🏔️ There's something magical about watching the world wake up from 1,717 meters above sea level.",
    timeAgo: "3 days ago",
    location: "Mount Batur, Bali",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1567,
    comments: [
      { username: "ocean_lover", text: "Beautiful blue hour shot!" },
      { username: "local_fisherman", text: "Thank you for capturing our work!" },
    ],
    caption:
      "Local fishermen at work during blue hour. Their dedication is truly inspiring 🎣 Started their day at 4am and still going strong as the sun sets. Respect for these hardworking souls.",
    timeAgo: "5 days ago",
    location: "Sanur Beach, Bali",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=400&width=400",
    likes: 2890,
    comments: [
      { username: "nature_lover", text: "Hidden gems are the best! 💚" },
      { username: "waterfall_hunter", text: "Adding this to my list!" },
    ],
    caption:
      "Hidden waterfall discovered during today's jungle trek! Nature never ceases to amaze me 💚 After 3 hours of hiking through dense jungle, this was the perfect reward. The sound of the water was absolutely therapeutic.",
    timeAgo: "1 week ago",
    location: "Sekumpul Falls, Bali",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1245,
    comments: [
      { username: "culture_enthusiast", text: "Beautiful traditions! 🙏" },
      { username: "temple_guide", text: "Thank you for respecting our culture" },
    ],
    caption:
      "Traditional Balinese ceremony at the local temple. Such rich culture and beautiful traditions 🙏 Feeling grateful to witness and document these sacred moments with permission from the local community.",
    timeAgo: "1 week ago",
    location: "Tanah Lot, Bali",
  },
]
const mockPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=400&width=400",
    likes: 3420,
    comments: 156,
    caption:
      "Golden hour magic at Tanah Lot Temple 🌅 The way the light dances on the ancient stones never gets old. This place holds so much history and spiritual energy.",
    timeAgo: "2 hours ago",
    location: "Tanah Lot, Bali",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=400&width=400",
    likes: 2890,
    comments: 98,
    caption:
      "Rice terraces of Jatiluwih - a UNESCO World Heritage site that showcases the incredible ingenuity of Balinese farmers. The morning mist makes everything look ethereal ✨",
    timeAgo: "1 day ago",
    location: "Jatiluwih, Bali",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=400&width=400",
    likes: 4156,
    comments: 234,
    caption:
      "Street food adventures in Ubud! This nasi gudeg from a local warung is absolutely incredible. Sometimes the best meals come from the most unexpected places 🍛",
    timeAgo: "3 days ago",
    location: "Ubud, Bali",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=400&width=400",
    likes: 1876,
    comments: 67,
    caption:
      "Sunrise hike to Mount Batur was challenging but so worth it! Nothing beats watching the world wake up from 1,717 meters above sea level 🏔️",
    timeAgo: "5 days ago",
    location: "Mount Batur, Bali",
  },
]

const mockFollowers = [
  {
    id: 1,
    name: "Sarah Explorer",
    username: "sarah_explorer",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    followers: "45K",
    bio: "Adventure seeker & nature photographer",
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "mike_photographer",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    followers: "12K",
    bio: "Street photographer based in Tokyo",
  },
  {
    id: 3,
    name: "Emma Wilson",
    username: "emma_foodie",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    followers: "89K",
    bio: "Food blogger & recipe creator",
  },
  {
    id: 4,
    name: "David Kim",
    username: "david_traveler",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    followers: "23K",
    bio: "Digital nomad exploring Asia",
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    username: "lisa_yoga",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    followers: "67K",
    bio: "Yoga instructor & wellness coach",
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
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>({})
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({})

  const person = personData[personId as keyof typeof personData] || personData[1]

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (!commentText) return

    const newComment = {
      username: "your_username",
      text: commentText,
      timestamp: "now",
      isOwn: true,
    }

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }))

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  const toggleComments = (postId: number) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleCommentInputChange = (postId: number, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }))
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
        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid gap-6">
              {mockPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post"
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(post.id)}
                            className={likedPosts[post.id] ? "text-red-500" : ""}
                          >
                            <Heart className={`w-6 h-6 ${likedPosts[post.id] ? "fill-current" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MessageCircle className="w-6 h-6" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="w-6 h-6" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="w-6 h-6" />
                        </Button>
                      </div>

                      <div className="font-semibold text-sm mb-2">
                        {(post.likes + (likedPosts[post.id] ? 1 : 0)).toLocaleString()} likes
                      </div>

                      <div className="text-sm mb-2">
                        <span className="font-semibold mr-2">{person.username}</span>
                        {post.caption}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{post.timeAgo}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{post.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="followers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Followers ({person.followers.toLocaleString()})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFollowers.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={follower.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{follower.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{follower.name}</span>
                            {follower.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                          </div>
                          <span className="text-sm text-gray-600">@{follower.username}</span>
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
                <CardTitle>Following ({person.following.toLocaleString()})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFollowers.map((following) => (
                    <div key={following.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={following.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{following.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{following.name}</span>
                            {following.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                          </div>
                          <span className="text-sm text-gray-600">@{following.username}</span>
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
    </div>
  )
}
