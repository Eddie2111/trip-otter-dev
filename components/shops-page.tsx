"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart, Filter, Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation";

const trendyProducts = [
  {
    id: 1,
    name: "Vintage Camera Strap",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 124,
    trending: true,
    shopId: 1,
  },
  {
    id: 2,
    name: "Travel Journal Set",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 89,
    trending: true,
    shopId: 2,
  },
  {
    id: 3,
    name: "Portable Phone Tripod",
    price: 19.99,
    originalPrice: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 156,
    trending: true,
    shopId: 3,
  },
  {
    id: 4,
    name: "Waterproof Phone Case",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 203,
    trending: true,
    shopId: 1,
  },
]

const shops = [
  {
    id: 1,
    name: "Adventure Gear Co.",
    specialty: "Outdoor Equipment",
    description: "Premium outdoor gear for adventurous travelers",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.8,
    reviews: 1240,
    location: "Mountain View, CA",
    verified: true,
    products: 156,
  },
  {
    id: 2,
    name: "Local Artisan Crafts",
    specialty: "Handmade Souvenirs",
    description: "Authentic local crafts and unique souvenirs",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.9,
    reviews: 890,
    location: "Santa Fe, NM",
    verified: true,
    products: 89,
  },
  {
    id: 3,
    name: "Tech Travel Hub",
    specialty: "Travel Technology",
    description: "Latest gadgets and tech accessories for travelers",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.7,
    reviews: 2100,
    location: "Austin, TX",
    verified: true,
    products: 234,
  },
  {
    id: 4,
    name: "Vintage Collectibles",
    specialty: "Antiques & Vintage",
    description: "Rare finds and vintage collectibles from around the world",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.6,
    reviews: 567,
    location: "Portland, OR",
    verified: false,
    products: 78,
  },
  {
    id: 5,
    name: "Foodie Paradise",
    specialty: "Gourmet Food",
    description: "Local delicacies and gourmet food products",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.9,
    reviews: 1560,
    location: "New Orleans, LA",
    verified: true,
    products: 145,
  },
  {
    id: 6,
    name: "Fashion Forward",
    specialty: "Travel Fashion",
    description: "Stylish and comfortable clothing for travelers",
    image: "/placeholder.svg?height=300&width=400",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.5,
    reviews: 890,
    location: "Los Angeles, CA",
    verified: true,
    products: 267,
  },
]

export function ShopsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("")

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Shops</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Discover Shops</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Trendy Products Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold">🔥 Trending for Tourism</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {trendyProducts.map((product) => (
                  <Card key={product.id} className="min-w-[200px] md:min-w-[240px] hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-32 md:h-40 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-red-500">Trending</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <Button size="sm" className="h-7 px-3 text-xs" onClick={() => router.push(`/shop/${product.shopId}`)}>
                          View Shop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Shops Grid */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Featured Shops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <Card
                  key={shop.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/shop/${shop.id}`)}
                >
                  <div className="relative">
                    <Image
                      src={shop.image || "/placeholder.svg"}
                      alt={shop.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={shop.avatar || "/placeholder.svg"} alt={shop.name} />
                          <AvatarFallback>{shop.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{shop.name}</h3>
                            {shop.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {shop.specialty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{shop.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{shop.rating}</span>
                          <span className="text-gray-500">({shop.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{shop.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{shop.products} products</span>
                        <Button size="sm" variant="outline">
                          Visit Shop
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export { shops, trendyProducts }
