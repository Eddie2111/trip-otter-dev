"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Clock, TrendingUp, Users, Hash, MapPin, Store, User, Star, MapPinIcon } from "lucide-react"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onPersonSelect: (personId: number) => void
  onGroupSelect: (groupId: number) => void
  onShopSelect: (shopId: number) => void
}

const mockSearchData = {
  people: [
    {
      id: 1,
      username: "john_traveler",
      name: "John Smith",
      avatar: "/placeholder.svg",
      followers: "12.5K",
      verified: true,
    },
    {
      id: 2,
      username: "sarah_explorer",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      followers: "8.2K",
      verified: false,
    },
    {
      id: 3,
      username: "mike_photographer",
      name: "Mike Wilson",
      avatar: "/placeholder.svg",
      followers: "25.1K",
      verified: true,
    },
    {
      id: 4,
      username: "emma_foodie",
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      followers: "15.7K",
      verified: false,
    },
  ],
  hashtags: [
    { tag: "travel", posts: "2.5M" },
    { tag: "photography", posts: "1.8M" },
    { tag: "food", posts: "3.2M" },
    { tag: "adventure", posts: "950K" },
    { tag: "nature", posts: "1.2M" },
  ],
  locations: [
    { id: 1, name: "Paris, France", posts: "850K" },
    { id: 2, name: "Tokyo, Japan", posts: "1.2M" },
    { id: 3, name: "New York, USA", posts: "2.1M" },
    { id: 4, name: "Bali, Indonesia", posts: "650K" },
  ],
  groups: [
    { id: 1, name: "Travel Photography", members: "45.2K", avatar: "/placeholder.svg", category: "Photography" },
    { id: 2, name: "Backpackers United", members: "32.8K", avatar: "/placeholder.svg", category: "Travel" },
    { id: 3, name: "Food Explorers", members: "28.5K", avatar: "/placeholder.svg", category: "Food" },
    { id: 4, name: "Adventure Seekers", members: "51.3K", avatar: "/placeholder.svg", category: "Adventure" },
  ],
  shops: [
    {
      id: 1,
      name: "Travel Gear Pro",
      rating: 4.8,
      products: "1.2K",
      avatar: "/placeholder.svg",
      category: "Travel Gear",
    },
    { id: 2, name: "Local Crafts Store", rating: 4.6, products: "850", avatar: "/placeholder.svg", category: "Crafts" },
    {
      id: 3,
      name: "Adventure Equipment",
      rating: 4.9,
      products: "2.1K",
      avatar: "/placeholder.svg",
      category: "Equipment",
    },
    {
      id: 4,
      name: "Souvenir Paradise",
      rating: 4.4,
      products: "650",
      avatar: "/placeholder.svg",
      category: "Souvenirs",
    },
  ],
}

const recentSearches = [
  { type: "person", query: "john_traveler", icon: User },
  { type: "hashtag", query: "#travel", icon: Hash },
  { type: "location", query: "Paris, France", icon: MapPin },
  { type: "group", query: "Travel Photography", icon: Users },
]

const trendingSearches = ["#wanderlust", "#foodie", "#photography", "Tokyo", "Adventure", "#sunset"]

export function SearchModal({ isOpen, onClose, onPersonSelect, onGroupSelect, onShopSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredResults, setFilteredResults] = useState(mockSearchData)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults(mockSearchData)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = {
      people: mockSearchData.people.filter(
        (person) => person.username.toLowerCase().includes(query) || person.name.toLowerCase().includes(query),
      ),
      hashtags: mockSearchData.hashtags.filter((hashtag) => hashtag.tag.toLowerCase().includes(query)),
      locations: mockSearchData.locations.filter((location) => location.name.toLowerCase().includes(query)),
      groups: mockSearchData.groups.filter(
        (group) => group.name.toLowerCase().includes(query) || group.category.toLowerCase().includes(query),
      ),
      shops: mockSearchData.shops.filter(
        (shop) => shop.name.toLowerCase().includes(query) || shop.category.toLowerCase().includes(query),
      ),
    }
    setFilteredResults(filtered)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handlePersonClick = (personId: number) => {
    onPersonSelect(personId)
    onClose()
  }

  const handleGroupClick = (groupId: number) => {
    onGroupSelect(groupId)
    onClose()
  }

  const handleShopClick = (shopId: number) => {
    onShopSelect(shopId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search people, hashtags, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
                onClick={clearSearch}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="hashtags">Tags</TabsTrigger>
              <TabsTrigger value="locations">Places</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="shops">Shops</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-96 mt-4">
              {!searchQuery && (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-sm">Recent</h3>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <search.icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{search.query}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="w-6 h-6">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-sm">Trending</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trend, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <TabsContent value="all" className="mt-0">
                {searchQuery && (
                  <div className="space-y-6">
                    {/* People Results */}
                    {filteredResults.people.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          People
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.people.slice(0, 3).map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handlePersonClick(person.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={person.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{person.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-sm">{person.username}</span>
                                  {person.verified && <Star className="w-3 h-3 text-blue-500 fill-current" />}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {person.name} • {person.followers} followers
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Groups Results */}
                    {filteredResults.groups.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Groups
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.groups.slice(0, 2).map((group) => (
                            <div
                              key={group.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handleGroupClick(group.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={group.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{group.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{group.name}</div>
                                <div className="text-xs text-gray-500">
                                  {group.members} members • {group.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shops Results */}
                    {filteredResults.shops.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          Shops
                        </h3>
                        <div className="space-y-2">
                          {filteredResults.shops.slice(0, 2).map((shop) => (
                            <div
                              key={shop.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => handleShopClick(shop.id)}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={shop.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{shop.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{shop.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <span>⭐ {shop.rating}</span>
                                  <span>•</span>
                                  <span>{shop.products} products</span>
                                  <span>•</span>
                                  <span>{shop.category}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="people" className="mt-0">
                <div className="space-y-2">
                  {filteredResults.people.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handlePersonClick(person.id)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">{person.username}</span>
                          {person.verified && <Star className="w-3 h-3 text-blue-500 fill-current" />}
                        </div>
                        <div className="text-xs text-gray-500">
                          {person.name} • {person.followers} followers
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hashtags" className="mt-0">
                <div className="space-y-2">
                  {filteredResults.hashtags.map((hashtag, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">#{hashtag.tag}</div>
                        <div className="text-xs text-gray-500">{hashtag.posts} posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="locations" className="mt-0">
                <div className="space-y-2">
                  {filteredResults.locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{location.name}</div>
                        <div className="text-xs text-gray-500">{location.posts} posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="mt-0">
                <div className="space-y-2">
                  {filteredResults.groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleGroupClick(group.id)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={group.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{group.name}</div>
                        <div className="text-xs text-gray-500">
                          {group.members} members • {group.category}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shops" className="mt-0">
                <div className="space-y-2">
                  {filteredResults.shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleShopClick(shop.id)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={shop.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{shop.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{shop.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>⭐ {shop.rating}</span>
                          <span>•</span>
                          <span>{shop.products} products</span>
                          <span>•</span>
                          <span>{shop.category}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Visit
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
