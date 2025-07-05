"use client"

import { useState } from "react"
import { ChatPage } from "./chat-page"
import { ShopsPage } from "./shops-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Camera,
  Home,
  Search,
  PlusSquare,
  User,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { ShopPage } from "./shop-page"
import { ProductPage } from "./product-page"

const stories = [
  { id: 1, username: "Your story", avatar: "/placeholder.svg?height=60&width=60", hasStory: false, isOwn: true },
  { id: 2, username: "john_doe", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 3, username: "jane_smith", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 4, username: "travel_blog", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 5, username: "food_lover", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 6, username: "tech_news", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 7, username: "art_gallery", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
  { id: 8, username: "music_vibes", avatar: "/placeholder.svg?height=60&width=60", hasStory: true },
]

const posts = [
  {
    id: 1,
    username: "nature_photographer",
    avatar: "/placeholder.svg?height=32&width=32",
    image: "/placeholder.svg?height=400&width=400",
    likes: 1234,
    caption:
      "Golden hour magic in the mountains 🏔️✨ There's nothing quite like watching the sun set behind these majestic peaks.",
    comments: [
      { username: "john_doe", text: "Absolutely stunning! 😍" },
      { username: "jane_smith", text: "This is incredible! Where was this taken?" },
      { username: "mountain_lover", text: "I need to visit this place!" },
    ],
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    username: "food_enthusiast",
    avatar: "/placeholder.svg?height=32&width=32",
    image: "/placeholder.svg?height=400&width=400",
    likes: 856,
    caption: "Homemade pasta night 🍝 Recipe in my bio! Nothing beats fresh pasta made from scratch.",
    comments: [
      { username: "chef_mike", text: "Looks delicious! 🤤" },
      { username: "pasta_lover", text: "Need this recipe ASAP!" },
    ],
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    username: "street_artist",
    avatar: "/placeholder.svg?height=32&width=32",
    image: "/placeholder.svg?height=400&width=400",
    likes: 2156,
    caption: "New mural downtown! Art brings life to the city 🎨 Spent 3 days working on this piece.",
    comments: [
      { username: "art_lover", text: "Your work is amazing!" },
      { username: "city_explorer", text: "I saw this today, so cool!" },
      { username: "mural_fan", text: "Best street art in the city!" },
    ],
    timeAgo: "6 hours ago",
  },
  {
    id: 4,
    username: "coffee_addict",
    avatar: "/placeholder.svg?height=32&width=32",
    image: "/placeholder.svg?height=400&width=400",
    likes: 543,
    caption: "Perfect latte art to start the morning ☕️ My barista skills are finally improving!",
    comments: [
      { username: "coffee_lover", text: "That foam art is perfect!" },
      { username: "morning_person", text: "Now I want coffee!" },
    ],
    timeAgo: "8 hours ago",
  },
]

const suggestedUsers = [
  {
    username: "alex_photos",
    name: "Alex Photography",
    avatar: "/placeholder.svg?height=32&width=32",
    mutualFollowers: 3,
  },
  {
    username: "design_studio",
    name: "Creative Studio",
    avatar: "/placeholder.svg?height=32&width=32",
    mutualFollowers: 7,
  },
  {
    username: "travel_couple",
    name: "Sarah & Mike",
    avatar: "/placeholder.svg?height=32&width=32",
    mutualFollowers: 12,
  },
  {
    username: "fitness_guru",
    name: "Fitness Coach",
    avatar: "/placeholder.svg?height=32&width=32",
    mutualFollowers: 5,
  },
]

export function InstagramFeed() {
  const [currentPage, setCurrentPage] = useState<"feed" | "chat" | "shops" | "shop" | "product">("feed")
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>({})
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [editingComment, setEditingComment] = useState<{ postId: number; commentIndex: number } | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  const handleShopSelect = (shopId: number) => {
    setSelectedShopId(shopId)
    setCurrentPage("shop")
  }

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId)
    setCurrentPage("product")
  }

  const handleBackToShops = () => {
    setSelectedShopId(null)
    setSelectedProductId(null)
    setCurrentPage("shops")
  }

  const handleBackToShop = () => {
    setSelectedProductId(null)
    setCurrentPage("shop")
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

  const handleEditComment = (postId: number, commentIndex: number, currentText: string) => {
    setEditingComment({ postId, commentIndex })
    setEditCommentText(currentText)
  }

  const handleSaveEdit = () => {
    if (!editingComment || !editCommentText.trim()) return

    const { postId, commentIndex } = editingComment

    setPostComments((prev) => {
      const updatedComments = [...(prev[postId] || [])]
      if (updatedComments[commentIndex]) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          text: editCommentText.trim(),
          edited: true,
        }
      }
      return {
        ...prev,
        [postId]: updatedComments,
      }
    })

    setEditingComment(null)
    setEditCommentText("")
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditCommentText("")
  }

  const handleDeleteComment = (postId: number, commentIndex: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setPostComments((prev) => {
        const updatedComments = [...(prev[postId] || [])]
        updatedComments.splice(commentIndex, 1)
        return {
          ...prev,
          [postId]: updatedComments,
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block sticky top-0 z-10 bg-white border-b">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ml-64">
              <Camera className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Tripotter</h1>
            </div>
            <div className="flex-1 max-w-xs mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 mr-8">
              <MessageCircle className="w-6 h-6 cursor-pointer" onClick={() => setCurrentPage("chat")} />
              <Heart className="w-6 h-6 cursor-pointer" />
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6" />
            <h1 className="text-xl font-bold">Tripotter</h1>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6" />
            <MessageCircle className="w-6 h-6 cursor-pointer" onClick={() => setCurrentPage("chat")} />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Left Sidebar - Now persistent across all pages */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r pt-20 z-20">
          <div className="p-4">
            <nav className="space-y-2">
              <Button
                variant={currentPage === "feed" ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => setCurrentPage("feed")}
              >
                <Home className="w-5 h-5" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                <Users className="w-5 h-5" />
                People
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                <User className="w-5 h-5" />
                Groups
              </Button>
              <Button
                variant={
                  currentPage === "shops" || currentPage === "shop" || currentPage === "product" ? "default" : "ghost"
                }
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => setCurrentPage("shops")}
              >
                <ShoppingBag className="w-5 h-5" />
                Shops
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Always accounts for left panel */}
        <div className="flex-1 md:ml-64">
          {currentPage === "chat" && <ChatPage />}
          {currentPage === "shops" && <ShopsPage onShopSelect={handleShopSelect} />}
          {currentPage === "shop" && selectedShopId && (
            <ShopPage shopId={selectedShopId} onBack={handleBackToShops} onProductSelect={handleProductSelect} />
          )}
          {currentPage === "product" && selectedProductId && selectedShopId && (
            <ProductPage productId={selectedProductId} shopId={selectedShopId} onBack={handleBackToShop} />
          )}
          {currentPage === "feed" && (
            <div className="max-w-6xl mx-auto flex gap-8 px-4 md:px-8 py-0 md:py-8">
              {/* Feed Content */}
              <div className="flex-1 max-w-none md:max-w-lg">
                {/* Stories */}
                <div className="bg-white border-b md:border md:rounded-lg mb-0 md:mb-6">
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 p-4 pb-3">
                      {stories.map((story) => (
                        <div key={story.id} className="flex flex-col items-center gap-1 min-w-[60px] md:min-w-[70px]">
                          <div
                            className={`relative ${story.hasStory ? "ring-2 ring-pink-500 ring-offset-2" : ""} rounded-full`}
                          >
                            <Avatar className="w-14 h-14 md:w-16 md:h-16">
                              <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.username} />
                              <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {story.isOwn && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <PlusSquare className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center max-w-[60px] md:max-w-[70px] truncate">
                            {story.isOwn ? "Your story" : story.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Feed Posts */}
                <div className="space-y-0 md:space-y-6 pb-20 md:pb-0">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="border-0 border-b md:border rounded-none md:rounded-lg shadow-none md:shadow-sm bg-white"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-3 md:p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10">
                            <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.username} />
                            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm md:text-base">{post.username}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            <DropdownMenuItem>Unfollow</DropdownMenuItem>
                            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Image */}
                      <CardContent className="p-0">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          width={400}
                          height={400}
                          className="w-full aspect-square object-cover"
                        />
                      </CardContent>

                      {/* Post Actions */}
                      <div className="p-3 md:p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                              <Heart className="w-6 h-6" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 p-0"
                              onClick={() => toggleComments(post.id)}
                            >
                              <MessageCircle className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                              <Send className="w-6 h-6" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                            <Bookmark className="w-6 h-6" />
                          </Button>
                        </div>

                        {/* Likes */}
                        <div className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</div>

                        {/* Caption */}
                        <div className="text-sm mb-2">
                          <span className="font-semibold mr-2">{post.username}</span>
                          {post.caption}
                        </div>

                        {/* Comments */}
                        <div className="space-y-1">
                          {post.comments.map((comment, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-semibold mr-2">{comment.username}</span>
                              {comment.text}
                            </div>
                          ))}
                          {postComments[post.id]?.map((comment, index) => (
                            <div key={`new-${index}`} className="text-sm">
                              <span className="font-semibold mr-2">{comment.username}</span>
                              {comment.text}
                              {comment.isOwn && <span className="text-xs text-gray-500 ml-2">{comment.timestamp}</span>}
                            </div>
                          ))}

                          {showComments[post.id] && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                  <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  {commentInputs[post.id]?.trim() && (
                                    <Button
                                      onClick={() => handleAddComment(post.id)}
                                      size="sm"
                                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 text-xs bg-blue-500 hover:bg-blue-600"
                                    >
                                      Post
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Show all comments when expanded */}
                              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                                {[...post.comments, ...(postComments[post.id] || [])].map((comment, index) => {
                                  const isOwnComment = comment.isOwn || comment.username === "your_username"
                                  const isFromNewComments = index >= post.comments.length
                                  const newCommentIndex = isFromNewComments ? index - post.comments.length : -1
                                  const isEditing =
                                    editingComment?.postId === post.id &&
                                    editingComment?.commentIndex === newCommentIndex &&
                                    isFromNewComments

                                  return (
                                    <div key={index} className="flex items-start gap-2 group">
                                      <Avatar className="w-6 h-6 mt-1">
                                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                        <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        {isEditing ? (
                                          <div className="space-y-2">
                                            <input
                                              type="text"
                                              value={editCommentText}
                                              onChange={(e) => setEditCommentText(e.target.value)}
                                              onKeyPress={(e) => {
                                                if (e.key === "Enter") handleSaveEdit()
                                                if (e.key === "Escape") handleCancelEdit()
                                              }}
                                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                              autoFocus
                                            />
                                            <div className="flex gap-2">
                                              <Button
                                                onClick={handleSaveEdit}
                                                size="sm"
                                                className="h-6 px-2 text-xs bg-blue-500 hover:bg-blue-600"
                                              >
                                                Save
                                              </Button>
                                              <Button
                                                onClick={handleCancelEdit}
                                                variant="outline"
                                                size="sm"
                                                className="h-6 px-2 text-xs bg-transparent"
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="text-sm">
                                              <span className="font-semibold mr-2">{comment.username}</span>
                                              {comment.text}
                                              {comment.edited && (
                                                <span className="text-xs text-gray-400 ml-2">(edited)</span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                              <span className="text-xs text-gray-500">{comment.timestamp || "2h"}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-gray-500 h-auto p-0"
                                              >
                                                Like
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-gray-500 h-auto p-0"
                                              >
                                                Reply
                                              </Button>
                                              {isOwnComment && isFromNewComments && (
                                                <>
                                                  <Button
                                                    onClick={() =>
                                                      handleEditComment(post.id, newCommentIndex, comment.text)
                                                    }
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs text-gray-500 h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                    Edit
                                                  </Button>
                                                  <Button
                                                    onClick={() => handleDeleteComment(post.id, newCommentIndex)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs text-red-500 h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                    Delete
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <Button variant="ghost" size="icon" className="w-4 h-4 mt-1">
                                        <Heart className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )
                                })}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleComments(post.id)}
                                className="text-xs text-gray-500 mt-2 h-auto p-0"
                              >
                                Hide comments
                              </Button>
                            </div>
                          )}

                          {!showComments[post.id] &&
                            (post.comments.length > 2 || postComments[post.id]?.length > 0) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleComments(post.id)}
                                className="text-xs text-gray-500 mt-1 h-auto p-0"
                              >
                                View all {post.comments.length + (postComments[post.id]?.length || 0)} comments
                              </Button>
                            )}
                        </div>

                        {/* Time */}
                        <div className="text-xs text-gray-500 mt-2 uppercase">{post.timeAgo}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Right Sidebar - Only visible on feed page */}
              <div className="hidden lg:block w-80 space-y-6">
                {/* User Profile Card */}
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src="/placeholder.svg?height=56&width=56" />
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">your_username</div>
                      <div className="text-sm text-gray-500">Your Name</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <div className="font-semibold">150</div>
                      <div className="text-gray-500">posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">1.2K</div>
                      <div className="text-gray-500">followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">800</div>
                      <div className="text-gray-500">following</div>
                    </div>
                  </div>
                </Card>

                {/* Suggestions */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-500">Suggestions For You</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      See All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {suggestedUsers.map((user) => (
                      <div key={user.username} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{user.username}</div>
                            <div className="text-xs text-gray-500">Followed by {user.mutualFollowers} others</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-500 text-xs font-semibold">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Footer Links */}
                <div className="text-xs text-gray-400 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span>About</span>
                    <span>Help</span>
                    <span>Press</span>
                    <span>API</span>
                    <span>Jobs</span>
                    <span>Privacy</span>
                    <span>Terms</span>
                  </div>
                  <div>© 2024 Tripotter</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" size="icon" className="w-12 h-12" onClick={() => setCurrentPage("feed")}>
            <Home className={`w-6 h-6 ${currentPage === "feed" ? "text-blue-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <Search className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <PlusSquare className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <Heart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
