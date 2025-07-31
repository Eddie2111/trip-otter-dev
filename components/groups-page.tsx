"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Users,
  TrendingUp,
  Lock,
  Globe,
  UserPlus,
  MessageCircle,
  Filter,
  Camera,
  Mountain,
  Utensils,
  Plane,
  Heart,
} from "lucide-react"

const trendingGroups = [
  {
    id: 1,
    name: "Travel Photography Masters",
    description: "Share your best travel shots and learn from pros",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 45000,
    posts: 1200,
    category: "Photography",
    isPrivate: false,
    tags: ["Photography", "Travel", "Tips"],
    activity: "Very Active",
    isJoined: false,
    growthRate: "+15.2%",
  },
  {
    id: 2,
    name: "Digital Nomad Community",
    description: "Remote workers sharing tips, locations, and experiences",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 32000,
    posts: 890,
    category: "Lifestyle",
    isPrivate: false,
    tags: ["Remote Work", "Travel", "Lifestyle"],
    activity: "Very Active",
    isJoined: true,
    growthRate: "+22.8%",
  },
  {
    id: 3,
    name: "Backpackers United",
    description: "Budget travel tips and backpacking adventures worldwide",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 28000,
    posts: 756,
    category: "Travel",
    isPrivate: false,
    tags: ["Backpacking", "Budget Travel", "Adventure"],
    activity: "Active",
    isJoined: false,
    growthRate: "+18.5%",
  },
  {
    id: 4,
    name: "Foodie Adventures",
    description: "Discover amazing cuisines and restaurants around the world",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 38000,
    posts: 1100,
    category: "Food",
    isPrivate: false,
    tags: ["Food", "Restaurants", "Culture"],
    activity: "Very Active",
    isJoined: false,
    growthRate: "+12.3%",
  },
]

const allGroups = [
  ...trendingGroups,
  {
    id: 5,
    name: "Mountain Climbers Elite",
    description: "For serious mountaineers and climbing enthusiasts",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 15000,
    posts: 420,
    category: "Adventure",
    isPrivate: true,
    tags: ["Climbing", "Mountains", "Extreme Sports"],
    activity: "Moderate",
    isJoined: false,
  },
  {
    id: 6,
    name: "Solo Female Travelers",
    description: "Safe travel tips and support for women traveling alone",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 22000,
    posts: 680,
    category: "Travel",
    isPrivate: false,
    tags: ["Solo Travel", "Safety", "Women"],
    activity: "Active",
    isJoined: true,
  },
  {
    id: 7,
    name: "Luxury Travel Experiences",
    description: "Premium destinations and high-end travel experiences",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 12000,
    posts: 340,
    category: "Luxury",
    isPrivate: true,
    tags: ["Luxury", "Premium", "Exclusive"],
    activity: "Moderate",
    isJoined: false,
  },
  {
    id: 8,
    name: "Street Food Hunters",
    description: "Finding the best street food in every corner of the world",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=120&width=300",
    members: 19000,
    posts: 590,
    category: "Food",
    isPrivate: false,
    tags: ["Street Food", "Local Cuisine", "Budget Eats"],
    activity: "Active",
    isJoined: false,
  },
]

const categories = [
  { name: "All", icon: Users, count: allGroups.length },
  { name: "Travel", icon: Plane, count: 4 },
  { name: "Photography", icon: Camera, count: 2 },
  { name: "Food", icon: Utensils, count: 3 },
  { name: "Adventure", icon: Mountain, count: 2 },
  { name: "Lifestyle", icon: Heart, count: 1 },
]

interface GroupsPageProps {
  onGroupSelect?: (groupId: number) => void
}

export function GroupsPage({ onGroupSelect }: GroupsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredGroups, setFilteredGroups] = useState(allGroups)

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === "All") {
      setFilteredGroups(allGroups)
    } else {
      setFilteredGroups(allGroups.filter((group) => group.category === category))
    }
  }

  const handleJoinToggle = (groupId: number) => {
    setFilteredGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, isJoined: !group.isJoined } : group)),
    )
  }

  const GroupCard = ({ group, isTrending = false }: { group: any; isTrending?: boolean }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute top-3 right-3 flex gap-2">
          {isTrending && group.growthRate && (
            <Badge className="bg-green-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              {group.growthRate}
            </Badge>
          )}
          <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            {group.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
            {group.isPrivate ? "Private" : "Public"}
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <Avatar className="w-16 h-16 border-4 border-white">
            <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
            <AvatarFallback>
              {group.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="p-4" onClick={() => onGroupSelect(group.id ?? 0)}>
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{group.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{group.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{group.members.toLocaleString()} members</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{group.posts} posts</span>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                group.activity === "Very Active"
                  ? "bg-green-100 text-green-700"
                  : group.activity === "Active"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {group.activity}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {group.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant={group.isJoined ? "outline" : "default"}
            className="flex-1"
            onClick={() => handleJoinToggle(group.id)}
          >
            {group.isJoined ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                Joined
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                {group.isPrivate ? "Request" : "Join"}
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Discover Groups</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(category.name)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Trending Groups */}
        {selectedCategory === "All" && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Trending Groups</h2>
                <p className="text-sm text-gray-600">Groups gaining popularity this week</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingGroups.map((group) => (
                <GroupCard key={group.id} group={group} isTrending />
              ))}
            </div>
          </section>
        )}

        {/* All Groups */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {selectedCategory === "All" ? "All Groups" : `${selectedCategory} Groups`}
              </h2>
              <p className="text-sm text-gray-600">{filteredGroups.length} groups found</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
