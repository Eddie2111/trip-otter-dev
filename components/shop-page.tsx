"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart, Share2, Filter, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { shops } from "./shops-page"

// Sample products for each shop
const shopProducts = {
  1: [
    // Adventure Gear Co.
    {
      id: 101,
      name: "Professional Hiking Backpack",
      price: 129.99,
      originalPrice: 159.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 89,
      inStock: true,
      description: "Durable 40L hiking backpack with multiple compartments and weather-resistant material",
      features: ["40L capacity", "Weather-resistant", "Multiple compartments", "Ergonomic design"],
      shopId: 1,
    },
    {
      id: 102,
      name: "Waterproof Camping Tent",
      price: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 156,
      inStock: true,
      description: "4-person waterproof tent perfect for camping adventures",
      features: ["4-person capacity", "Waterproof", "Easy setup", "Lightweight"],
      shopId: 1,
    },
    {
      id: 103,
      name: "Portable Camping Stove",
      price: 45.99,
      originalPrice: 59.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 234,
      inStock: false,
      description: "Compact and lightweight camping stove for outdoor cooking",
      features: ["Compact design", "Lightweight", "Fuel efficient", "Wind resistant"],
      shopId: 1,
    },
    {
      id: 104,
      name: "Multi-tool Survival Kit",
      price: 34.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 178,
      inStock: true,
      description: "Essential survival tools in one compact package",
      features: ["15 tools in 1", "Stainless steel", "Compact", "Durable"],
      shopId: 1,
    },
    {
      id: 105,
      name: "Solar Power Bank",
      price: 79.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviews: 92,
      inStock: true,
      description: "20000mAh solar power bank for extended outdoor trips",
      features: ["20000mAh capacity", "Solar charging", "Waterproof", "LED flashlight"],
      shopId: 1,
    },
    {
      id: 106,
      name: "Insulated Water Bottle",
      price: 24.99,
      originalPrice: 34.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 312,
      inStock: true,
      description: "32oz stainless steel insulated water bottle",
      features: ["32oz capacity", "24h cold retention", "12h hot retention", "BPA-free"],
      shopId: 1,
    },
  ],
  2: [
    // Local Artisan Crafts
    {
      id: 201,
      name: "Handwoven Dream Catcher",
      price: 39.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 67,
      inStock: true,
      description: "Authentic handwoven dream catcher made by local artisans",
      features: ["Handmade", "Natural materials", "Traditional design", "Unique piece"],
      shopId: 2,
    },
    {
      id: 202,
      name: "Ceramic Coffee Mug Set",
      price: 29.99,
      originalPrice: 39.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 123,
      inStock: true,
      description: "Set of 2 handcrafted ceramic coffee mugs with local artwork",
      features: ["Set of 2", "Handcrafted", "Local artwork", "Dishwasher safe"],
      shopId: 2,
    },
    {
      id: 203,
      name: "Leather Journal",
      price: 49.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 89,
      inStock: true,
      description: "Premium leather-bound journal with handmade paper",
      features: ["Genuine leather", "Handmade paper", "200 pages", "Vintage design"],
      shopId: 2,
    },
    {
      id: 204,
      name: "Wooden Wind Chimes",
      price: 34.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 45,
      inStock: false,
      description: "Handcrafted wooden wind chimes with soothing tones",
      features: ["Handcrafted", "Natural wood", "Soothing tones", "Weather resistant"],
      shopId: 2,
    },
  ],
  3: [
    // Tech Travel Hub
    {
      id: 301,
      name: "Wireless Travel Charger",
      price: 59.99,
      originalPrice: 79.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 234,
      inStock: true,
      description: "Fast wireless charging pad perfect for travel",
      features: ["Fast charging", "Compact design", "Universal compatibility", "LED indicator"],
      shopId: 3,
    },
    {
      id: 302,
      name: "Bluetooth Travel Speaker",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 167,
      inStock: true,
      description: "Portable Bluetooth speaker with premium sound quality",
      features: ["12-hour battery", "Waterproof", "Premium sound", "Compact"],
      shopId: 3,
    },
    {
      id: 303,
      name: "Travel Router",
      price: 79.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 98,
      inStock: true,
      description: "Portable WiFi router for secure internet anywhere",
      features: ["Secure connection", "Long battery life", "Multiple devices", "Compact"],
      shopId: 3,
    },
  ],
}

interface ShopPageProps {
  shopId: number
  onBack: () => void
  onProductSelect: (productId: number) => void
}

export function ShopPage({ shopId, onBack, onProductSelect }: ShopPageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const shop = shops.find((s) => s.id === shopId)
  const products = shopProducts[shopId as keyof typeof shopProducts] || []

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold truncate">{shop.name}</h1>
        </div>
      </div>

      {/* Shop Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="hidden md:block mb-4">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={shop.image || "/placeholder.svg"}
              alt={shop.name}
              width={400}
              height={300}
              className="w-full md:w-80 h-48 md:h-60 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={shop.avatar || "/placeholder.svg"} alt={shop.name} />
                      <AvatarFallback>{shop.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{shop.name}</h1>
                        {shop.verified && <Badge>Verified</Badge>}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {shop.specialty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{shop.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{shop.rating}</span>
                      <span className="text-gray-500">({shop.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{shop.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Products ({filteredProducts.length})</h2>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-4 py-2 w-64 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <Link href={`/product/${product.id}?shopId=${shopId}`}>
                <CardContent className="p-3 md:p-4">
                  <div className="relative mb-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-32 md:h-40 object-cover rounded-lg"
                    />
                    {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500 text-xs">Sale</Badge>}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">Out of Stock</span>
                      </div>
                    )}
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
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { shopProducts }
