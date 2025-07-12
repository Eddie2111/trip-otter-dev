"use client"

import { useEffect, useState } from "react"
import { ChatPage } from "./chat-page"
import { ShopsPage } from "./shops-page"
import { GroupsPage } from "./groups-page"
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
  PlusSquare,
} from "lucide-react"
import Image from "next/image"
import { GroupPage } from "./group-page"
import { PeoplePage } from "./people-page"
import { SearchModal } from "./search-modal"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"
import { suggestedUsers, posts, stories,} from "@/data/mocks/feed.mock";
import { useRouter } from "next/navigation"
import { Loading } from "./ui/loading"
import { DesktopHeader } from "./desktop-header"
import { DesktopSidebar } from "./desktop-sidebar"
import { PostContainer } from "./post-card_v2"

export function TripotterFeed() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<"feed" | "chat" | "shops" | "shop" | "product" | "groups" | "group" | "people" | "person" | "settings">("feed")
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>({})
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [editingComment, setEditingComment] = useState<{ postId: number; commentIndex: number } | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  const [showSearchModal, setShowSearchModal] = useState(false)
  useEffect(() => {
    async function getFeed() { 
      const response = await fetch('/api/feed')
      const data = await response.json()
      console.log(data);
    }
    getFeed();
   })

  // Use NextAuth session hook
  const { data: session, status } = useSession()

  // Determine authentication state based on session
  const isAuthenticated = status === "authenticated" && !!session?.user

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      })
      toast.success("Come back soon!")
      setCurrentPage("feed")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Something went wrong during logout. Please try again.")
    }
  }

  const handleGroupSelect = (groupId: number) => {
    setSelectedGroupId(groupId)
    setCurrentPage("group")
  }

  const handleBackToGroups = () => {
    setSelectedGroupId(null)
    setCurrentPage("groups")
  }

  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim()
    if (!commentText) return

    const newComment = {
      username: session?.user?.name || "your_username",
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

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <Loading/>
  }

  // Authentication check - redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return <Loading/>

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onPersonSelect={() => {}}
        onGroupSelect={handleGroupSelect}
        onShopSelect={() => {}}
      />
      {/* Desktop Header */}
      <DesktopHeader
        setShowSearchModal={setShowSearchModal}
        setCurrentPage={setCurrentPage}
        session={session}
        handleLogout={handleLogout}
      />

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6" />
            <h1 className="text-xl font-bold">Tripotter</h1>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6" />
            <MessageCircle
              className="w-6 h-6 cursor-pointer"
              onClick={() => setCurrentPage("chat")}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Left Sidebar - Now persistent across all pages */}
        <DesktopSidebar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {currentPage === "chat" && <ChatPage />}
          {currentPage === "shops" && <ShopsPage />}
          {currentPage === "groups" && (
            <GroupsPage onGroupSelect={handleGroupSelect} />
          )}
          {currentPage === "group" && selectedGroupId && (
            <GroupPage groupId={selectedGroupId} onBack={handleBackToGroups} />
          )}
          {currentPage === "people" && <PeoplePage onPersonSelect={() => {}} />}
          {currentPage === "feed" && (
            <div className="max-w-6xl mx-auto flex gap-8 px-4 md:px-8 py-0 md:py-8">
              {/* Feed */}
              <div className="flex-1 max-w-none md:max-w-lg">
                {/* Stories */}
                <Card className="mb-6 bg-white">
                  <CardContent className="p-4">
                    <ScrollArea className="w-full">
                      <div className="flex gap-4 pb-2">
                        {stories.map((story) => (
                          <div
                            key={story.id}
                            className="flex flex-col items-center gap-1 min-w-0"
                          >
                            <div
                              className={`relative ${
                                story.hasStory && !story.isOwn
                                  ? "bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5 rounded-full"
                                  : ""
                              }`}
                            >
                              <Avatar
                                className={`w-14 h-14 ${
                                  story.hasStory && !story.isOwn
                                    ? "border-2 border-white"
                                    : ""
                                }`}
                              >
                                <AvatarImage
                                  src={story.avatar || "/placeholder.svg"}
                                  alt={story.username}
                                />
                                <AvatarFallback>
                                  {story.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {story.isOwn && (
                                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                                  <PlusSquare className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-center truncate w-16">
                              {story.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Posts */}
                <PostContainer />
              </div>

              {/* Right Sidebar - Suggested Users */}
              <div className="hidden lg:block w-80 space-y-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-500">
                      Suggested for you
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold"
                    >
                      See All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {suggestedUsers.map((user) => (
                      <div
                        key={user.username}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">
                              {user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              Followed by {user.mutualFollowers} others
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 text-xs font-semibold"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="text-xs text-gray-400 space-y-1">
                  <div>About • Help • Press • API • Jobs • Privacy • Terms</div>
                  <div>Locations • Language • Meta Verified</div>
                  <div className="mt-4">© 2024 Tripotter from Meta</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
