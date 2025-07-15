"use client";

import { useEffect, useState } from "react";
// Removed imports for ChatPage, ShopsPage, GroupsPage, GroupPage, PeoplePage as they will be separate pages
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Camera,
  PlusSquare,
} from "lucide-react";
import Image from "next/image";
import { SearchModal } from "./search-modal";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link"; // Import Link for navigation
import { suggestedUsers, posts, stories } from "@/data/mocks/feed.mock";
import { useRouter } from "next/navigation"; // Import useRouter for programmatic navigation
import { Loading } from "./ui/loading";
import { DesktopHeader } from "./desktop-header";
import { DesktopSidebar } from "./desktop-sidebar";
import { PostContainer } from "./post-card_v2";
import { Sidebar } from "./mobile-sidebar";

export function TripotterFeed() {
  const router = useRouter(); // Initialize useRouter hook
  // Removed currentPage state as routing is now handled by Next.js Link/Router
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // Still needed for dynamic group page navigation
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editingComment, setEditingComment] = useState<{
    postId: number;
    commentIndex: number;
  } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [showSearchModal, setShowSearchModal] = useState(false);
  useEffect(() => {
    async function getFeed() {
      const response = await fetch("/api/feed");
      const data = await response.json();
      // console.log(data);
    }
    getFeed();
  });

  // Use NextAuth session hook
  const { data: session, status } = useSession();

  // Determine authentication state based on session
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
      toast.success("Come back soon!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout. Please try again.");
    }
  };

  const handleGroupSelect = (groupId: number) => {
    setSelectedGroupId(groupId);
    router.push(`/groups/${groupId}`); // Use router.push for dynamic group page navigation
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
    router.push("/groups"); // Use router.push to navigate back to groups page
  };

  const handleAddComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      username: session?.user?.name || "your_username",
      text: commentText,
      timestamp: "now",
      isOwn: true,
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const toggleComments = (postId: number) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentInputChange = (postId: number, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleEditComment = (
    postId: number,
    commentIndex: number,
    currentText: string
  ) => {
    setEditingComment({ postId, commentIndex });
    setEditCommentText(currentText);
  };

  const handleSaveEdit = () => {
    if (!editingComment || !editCommentText.trim()) return;

    const { postId, commentIndex } = editingComment;

    setPostComments((prev) => {
      const updatedComments = [...(prev[postId] || [])];
      if (updatedComments[commentIndex]) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          text: editCommentText.trim(),
          edited: true,
        };
      }
      return {
        ...prev,
        [postId]: updatedComments,
      };
    });

    setEditingComment(null);
    setEditCommentText("");
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (postId: number, commentIndex: number) => {
    // Replaced window.confirm with a custom modal UI for better UX and consistency
    // For demonstration, a simple console log is used. In a real app, you'd show a modal.
    console.log("Confirming delete for comment:", postId, commentIndex);
    // Example of how you might integrate a modal:
    // showConfirmModal("Are you sure you want to delete this comment?", () => {
    setPostComments((prev) => {
      const updatedComments = [...(prev[postId] || [])];
      updatedComments.splice(commentIndex, 1);
      return {
        ...prev,
        [postId]: updatedComments,
      };
    });
    // });
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <Loading />;
  }

  // Authentication check - redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onPersonSelect={() => {}} // This would also use router.push to a person's page
        onGroupSelect={handleGroupSelect}
        onShopSelect={() => {}} // This would also use router.push to a shop's page
      />
      {/* Desktop Header */}
      <DesktopHeader
        setShowSearchModal={setShowSearchModal}
        session={session}
        handleLogout={handleLogout}
      />

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sidebar/>
            <Camera className="w-6 h-6" />
            <h1 className="text-xl font-bold">Tripotter</h1>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6" />
            {/* Changed onClick to Link for chat navigation */}
            <Link href="/chat" className="flex items-center">
              <MessageCircle className="w-6 h-6 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Left Sidebar - Now persistent across all pages */}

        {/* Main Content - Now only renders the feed content directly */}
        <div className="flex-1 md:ml-64">

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
                <div>Locations • Language </div>
                <div className="mt-4">© 2025 Tripotter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
