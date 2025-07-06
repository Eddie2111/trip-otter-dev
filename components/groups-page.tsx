"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, TrendingUp, Star, Plus, Clock, MessageCircle, Globe, Lock } from "lucide-react"

interface GroupsPageProps {
  onGroupSelect: (groupId: number) => void
}

const trendingGroups = [
  {
    id: 1,
    name: "Travel Photography Masters",
    description:
      "A community for passionate travel photographers sharing tips, techniques, and breathtaking shots from around the world.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    members: "45.2K",
    posts: "1.2K",
    category: "Photography",
    privacy: "Public",
    activity: "Very Active",
    tags: ["photography", "travel", "landscape"],
    recentActivity: "2 hours ago",
    isJoined: false,
  },
  {
    id: 2,
    name: "Backpackers United",
    description:
      "Connect with fellow backpackers, share travel stories, get advice on budget travel, and find travel companions.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    members: "32.8K",
    posts: "856",
    category: "Travel",
    privacy: "Public",
    activity: "Active",
    tags: ["backpacking", "budget-travel", "adventure"],
    recentActivity: "1 hour ago",
    isJoined: true,
  },
  {
    id: 3,
    name: "Food Explorers Global",
    description:
      "Discover authentic local cuisines, share food experiences, and connect with food lovers from every corner of the globe.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    members: "28.5K",
    posts: "2.1K",
    category: "Food",
    privacy: "Public",
    activity: "Very Active",
    tags: ["food", "cuisine", "local-food"],
    recentActivity: "30 minutes ago",
    isJoined: false,
  },
  {
    id: 4,
    name: "Adventure Seekers",
    description:
      "For thrill-seekers and adventure enthusiasts. Share your extreme sports experiences and plan epic adventures together.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    members: "51.3K",
    posts: "1.8K",
    category: "Adventure",
    privacy: "Public",
    activity: "Active",
    tags: ["adventure", "extreme-sports", "hiking"],
    recentActivity: "45 minutes ago",
    isJoined: false,
  },
]

const myGroups = [
  {
    id: 2,
    name: "Backpackers United",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "32.8K",
    unreadPosts: 12,
    lastActivity: "2 hours ago",
    role: "Member",
  },
  {
    id: 5,
    name: "Digital Nomads Hub",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "67.1K",
    unreadPosts: 5,
    lastActivity: "4 hours ago",
    role: "Admin",
  },
  {
    id: 6,
    name: "Solo Female Travelers",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "23.4K",
    unreadPosts: 8,
    lastActivity: "1 day ago",
    role: "Moderator",
  },
]

const suggestedGroups = [
  {
    id: 7,
    name: "Street Art Hunters",
    description: "Discover and share amazing street art from cities around the world.",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "15.7K",
    category: "Art",
    reason: "Based on your interests in photography",
    mutualMembers: 8,
  },
  {
    id: 8,
    name: "Sustainable Travel",
    description: "Promoting eco-friendly and responsible travel practices.",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "19.2K",
    category: "Environment",
    reason: "Popular in your network",
    mutualMembers: 12,
  },
  {
    id: 9,
    name: "Local Guides Network",
    description: "Connect with local guides and get insider tips for your travels.",
    avatar: "/placeholder.svg?height=60&width=60",
    members: "41.8K",
    category: "Travel",
    reason: "Recommended for you",
    mutualMembers: 15,
  },
]

export function GroupsPage({ onGroupSelect }: GroupsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrivacy, setSelectedPrivacy] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Groups</h1>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Trending Groups</h2>
            </div>

            <div className="space-y-6">
              {trendingGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onGroupSelect(group.id)}
                >
                  <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg">
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-16 h-16 border-2 border-white">
                          <AvatarImage src={group.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-white">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm opacity-90">
                            <Users className="w-4 h-4" />
                            {group.members} members
                            <span>•</span>
                            {group.privacy === "Public" ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {group.privacy}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-2">{group.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {group.posts} posts
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {group.recentActivity}
                        </div>
                      </div>
                      <Badge variant={group.activity === "Very Active" ? "default" : "secondary"}>
                        {group.activity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{group.category}</Badge>
                        <div className="flex gap-1">
                          {group.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant={group.isJoined ? "outline" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        {group.isJoined ? "Joined" : "Join Group"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">My Groups</h2>
            </div>

            <div className="space-y-4">
              {myGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onGroupSelect(group.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {group.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                          <span>{group.members} members</span>
                          <span>Last activity: {group.lastActivity}</span>
                        </div>
                        {group.unreadPosts > 0 && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <MessageCircle className="w-4 h-4" />
                            {group.unreadPosts} new posts
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggested" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Suggested for You</h2>
            </div>

            <div className="space-y-4">
              {suggestedGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onGroupSelect(group.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{group.description}</p>
                        <p className="text-xs text-blue-600 mb-2">{group.reason}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{group.members} members</span>
                            {group.mutualMembers > 0 && <span>{group.mutualMembers} mutual members</span>}
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
