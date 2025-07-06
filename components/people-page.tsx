"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Star, Users, TrendingUp, UserPlus, MessageCircle } from "lucide-react"

interface PeoplePageProps {
  onPersonSelect: (personId: number) => void
}

const trendingPeople = [
  {
    id: 1,
    username: "alex_wanderer",
    name: "Alex Thompson",
    avatar: "/placeholder.svg?height=80&width=80",
    followers: "125K",
    following: "892",
    posts: "1.2K",
    bio: "Travel photographer & storyteller 📸 Currently in Bali 🌴",
    location: "Bali, Indonesia",
    verified: true,
    category: "Travel",
    mutualConnections: 12,
  },
  {
    id: 2,
    username: "sarah_foodie",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    followers: "89K",
    following: "1.2K",
    posts: "856",
    bio: "Food blogger & chef 👩‍🍳 Sharing recipes from around the world 🌍",
    location: "Tokyo, Japan",
    verified: true,
    category: "Food",
    mutualConnections: 8,
  },
  {
    id: 3,
    username: "mike_adventure",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    followers: "156K",
    following: "654",
    posts: "2.1K",
    bio: "Adventure seeker & mountain climber 🏔️ Living life on the edge",
    location: "Colorado, USA",
    verified: false,
    category: "Adventure",
    mutualConnections: 15,
  },
  {
    id: 4,
    username: "emma_culture",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=80&width=80",
    followers: "67K",
    following: "2.1K",
    posts: "945",
    bio: "Cultural explorer & historian 🏛️ Discovering hidden gems worldwide",
    location: "Rome, Italy",
    verified: false,
    category: "Culture",
    mutualConnections: 6,
  },
]

const nearbyPeople = [
  {
    id: 5,
    username: "local_guide_tom",
    name: "Tom Anderson",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "12K",
    bio: "Local guide & photographer",
    location: "2.5 km away",
    category: "Local Guide",
    mutualConnections: 3,
  },
  {
    id: 6,
    username: "cafe_owner_lisa",
    name: "Lisa Park",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "8.5K",
    bio: "Café owner & coffee enthusiast",
    location: "1.8 km away",
    category: "Business",
    mutualConnections: 1,
  },
  {
    id: 7,
    username: "artist_james",
    name: "James Miller",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "15K",
    bio: "Street artist & muralist",
    location: "3.2 km away",
    category: "Art",
    mutualConnections: 7,
  },
]

const suggestedPeople = [
  {
    id: 8,
    username: "yoga_instructor_anna",
    name: "Anna Kumar",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "34K",
    bio: "Yoga instructor & wellness coach",
    location: "Mumbai, India",
    category: "Wellness",
    mutualConnections: 9,
    reason: "Followed by friends you know",
  },
  {
    id: 9,
    username: "chef_marco",
    name: "Marco Rossi",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "78K",
    bio: "Italian chef & cookbook author",
    location: "Florence, Italy",
    category: "Food",
    mutualConnections: 4,
    reason: "Similar interests",
  },
  {
    id: 10,
    username: "photographer_zoe",
    name: "Zoe Taylor",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "92K",
    bio: "Wildlife photographer & conservationist",
    location: "Kenya",
    category: "Photography",
    mutualConnections: 11,
    reason: "Popular in your network",
  },
]

export function PeoplePage({ onPersonSelect }: PeoplePageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">People</h1>
            <div className="flex items-center gap-2">
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
                placeholder="Search people..."
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
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="nearby">Nearby</SelectItem>
                <SelectItem value="same-city">Same City</SelectItem>
                <SelectItem value="same-country">Same Country</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Trending People</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {trendingPeople.map((person) => (
                <Card
                  key={person.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPersonSelect(person.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{person.name}</h3>
                          {person.verified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">@{person.username}</p>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{person.bio}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          <MapPin className="w-3 h-3" />
                          {person.location}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                          <span>
                            <strong>{person.followers}</strong> followers
                          </span>
                          <span>
                            <strong>{person.posts}</strong> posts
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {person.category}
                            </Badge>
                            {person.mutualConnections > 0 && (
                              <span className="text-xs text-gray-500">{person.mutualConnections} mutual</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <UserPlus className="w-3 h-3 mr-1" />
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nearby" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold">People Near You</h2>
            </div>

            <div className="space-y-4">
              {nearbyPeople.map((person) => (
                <Card
                  key={person.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPersonSelect(person.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{person.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {person.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">@{person.username}</p>
                        <p className="text-sm text-gray-700 mb-1">{person.bio}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{person.location}</span>
                            <span>{person.followers} followers</span>
                            {person.mutualConnections > 0 && <span>{person.mutualConnections} mutual</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Message
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggested" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Suggested for You</h2>
            </div>

            <div className="space-y-4">
              {suggestedPeople.map((person) => (
                <Card
                  key={person.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPersonSelect(person.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{person.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {person.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">@{person.username}</p>
                        <p className="text-sm text-gray-700 mb-1">{person.bio}</p>
                        <p className="text-xs text-blue-600 mb-2">{person.reason}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{person.location}</span>
                            <span>{person.followers} followers</span>
                            {person.mutualConnections > 0 && <span>{person.mutualConnections} mutual</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Message
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Follow
                            </Button>
                          </div>
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
