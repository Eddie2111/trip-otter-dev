"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Share,
  MoreHorizontal,
  Heart,
  ImageIcon,
  Calendar,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  Bell,
  Pin,
} from "lucide-react"
import Image from "next/image"

interface GroupPageProps {
  groupId: number
  onBack: () => void
}

const groupData = {
  1: {
    name: "Travel Photography Masters",
    description:
      "A community for passionate travel photographers sharing tips, techniques, and breathtaking shots from around the world. Join us to improve your skills, get feedback, and discover amazing destinations through the lens of fellow photographers.",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=300&width=800",
    members: "45.2K",
    posts: "1.2K",
    category: "Photography",
    privacy: "Public",
    created: "March 2020",
    rules: [
      "Be respectful and constructive in your feedback",
      "Only post original photography content",
      "Include location and camera settings when possible",
      "No spam or promotional content",
      "Help fellow photographers learn and grow",
    ],
    admins: [
      { username: "photo_master", name: "Alex Chen", avatar: "/placeholder.svg" },
      { username: "lens_wizard", name: "Sarah Kim", avatar: "/placeholder.svg" },
    ],
    isJoined: false,
    isMember: false,
  },
}

const posts = [
  {
    id: 1,
    author: {
      username: "mountain_explorer",
      name: "Jake Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
    },
    content:
      "Just captured this incredible sunrise at Mount Fuji! The conditions were perfect - clear skies and minimal wind. Shot with Canon 5D Mark IV, 24-70mm f/2.8 at 35mm, ISO 100, f/8, 1/125s. What do you think about the composition?",
    image: "/placeholder.svg?height=400&width=600",
    likes: 234,
    comments: 45,
    shares: 12,
    timeAgo: "2 hours ago",
    isPinned: true,
    location: "Mount Fuji, Japan",
  },
  {
    id: 2,
    author: {
      username: "street_photographer",
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Moderator",
    },
    content:
      "Street photography tip: Sometimes the best shots happen when you're not actively looking for them. This candid moment in Tokyo's Shibuya crossing perfectly captures the energy of the city. Always keep your camera ready!",
    image: "/placeholder.svg?height=400&width=600",
    likes: 189,
    comments: 32,
    shares: 8,
    timeAgo: "5 hours ago",
    isPinned: false,
    location: "Tokyo, Japan",
  },
  {
    id: 3,
    author: {
      username: "nature_lens",
      name: "David Park",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
    },
    content:
      "Golden hour magic in the Scottish Highlands! This was taken during a 3-day hiking trip. The weather was challenging, but moments like these make it all worth it. Any tips for shooting in harsh weather conditions?",
    image: "/placeholder.svg?height=400&width=600",
    likes: 156,
    comments: 28,
    shares: 15,
    timeAgo: "1 day ago",
    isPinned: false,
    location: "Scottish Highlands, UK",
  },
]

const events = [
  {
    id: 1,
    title: "Photography Workshop: Landscape Techniques",
    date: "March 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Central Park, New York",
    attendees: 45,
    maxAttendees: 50,
    type: "Workshop",
  },
  {
    id: 2,
    title: "Photo Walk: Street Photography",
    date: "March 22, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Downtown LA",
    attendees: 28,
    maxAttendees: 30,
    type: "Photo Walk",
  },
]

const members = [
  { username: "photo_master", name: "Alex Chen", avatar: "/placeholder.svg", role: "Admin", posts: 156 },
  { username: "lens_wizard", name: "Sarah Kim", avatar: "/placeholder.svg", role: "Admin", posts: 89 },
  { username: "mountain_explorer", name: "Jake Wilson", avatar: "/placeholder.svg", role: "Member", posts: 67 },
  {
    username: "street_photographer",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg",
    role: "Moderator",
    posts: 134,
  },
  { username: "nature_lens", name: "David Park", avatar: "/placeholder.svg", role: "Member", posts: 45 },
]

export function GroupPage({ groupId, onBack }: GroupPageProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [newPost, setNewPost] = useState("")
  const [isJoined, setIsJoined] = useState(false)

  const group = groupData[groupId as keyof typeof groupData] || groupData[1]

  const handleJoinGroup = () => {
    setIsJoined(!isJoined)
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // Handle post creation
      setNewPost("")
    }
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
              <h1 className="font-semibold">{group.name}</h1>
              <p className="text-sm text-gray-500">
                {group.privacy} group • {group.members} members
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500">
          <Image src={group.coverImage || "/placeholder.svg"} alt="Group cover" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        {/* Group Info */}
        <div className="bg-white px-4 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={group.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{group.name[0]}</AvatarFallback>
              </Avatar>

              <div className="md:mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{group.name}</h1>
                  {group.privacy === "Public" ? (
                    <Globe className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>
                    <strong>{group.members}</strong> members
                  </span>
                  <span>
                    <strong>{group.posts}</strong> posts
                  </span>
                  <Badge variant="outline">{group.category}</Badge>
                </div>
                <p className="text-sm text-gray-600">Created {group.created}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
              <Button variant={isJoined ? "outline" : "default"} onClick={handleJoinGroup}>
                <UserPlus className="w-4 h-4 mr-2" />
                {isJoined ? "Joined" : "Join Group"}
              </Button>
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notify
              </Button>
              <Button variant="outline" size="icon">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <p className="text-gray-800 leading-relaxed">{group.description}</p>
          </div>

          {/* Admins */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Admins</h3>
            <div className="flex gap-3">
              {group.admins.map((admin, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{admin.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{admin.name}</p>
                    <p className="text-xs text-gray-500">@{admin.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white border-t">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="posts"
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none bg-transparent"
              >
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0 p-4 space-y-6">
              {/* Create Post */}
              {isJoined && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="Share your photography tips, ask questions, or show your latest work..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Add Photo
                          </Button>
                          <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Posts */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-0">
                      {/* Post Header */}
                      <div className="p-4 pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {post.author.role}
                                </Badge>
                                {post.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>@{post.author.username}</span>
                                <span>•</span>
                                <span>{post.timeAgo}</span>
                                {post.location && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {post.location}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 py-3">
                        <p className="text-gray-800 leading-relaxed">{post.content}</p>
                      </div>

                      {/* Post Image */}
                      {post.image && (
                        <div className="relative aspect-video">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Share className="w-4 h-4" />
                              {post.shares}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0 p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>

              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {event.attendees}/{event.maxAttendees} attending
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline">{event.type}</Badge>
                          <Button size="sm">Join Event</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="members" className="mt-0 p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Members ({group.members})</h2>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <Card key={member.username}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{member.name}</h3>
                              <Badge
                                variant={
                                  member.role === "Admin"
                                    ? "default"
                                    : member.role === "Moderator"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">@{member.username}</p>
                            <p className="text-xs text-gray-500">{member.posts} posts in group</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-0 p-4 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">About This Group</h2>
                <p className="text-gray-700 leading-relaxed">{group.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Group Rules</h3>
                <div className="space-y-2">
                  {group.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-semibold">{index + 1}.</span>
                      <span className="text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Privacy:</span>
                  <p className="font-medium">{group.privacy}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">{group.created}</p>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{group.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Posts:</span>
                  <p className="font-medium">{group.posts}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
