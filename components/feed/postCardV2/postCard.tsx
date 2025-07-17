
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
} from "lucide-react";
import Link from "next/link";

import { useCommentApi, useLikeApi } from "@/lib/requests";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { IPostProps } from "@/types/post";

import { toast } from "sonner";
import { ReportModal } from "@/components/report-modal";
import GridMedia from "@/components/grid-media";
import { User } from "./user";


export function PostCardV2({
  post,
  session,
}: {
  post: IPostProps;
  session: any;
}) {
  const currentLoggedInUser = session?.user;

  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  // State to manage whether all comments are displayed or only a limited number
  const [showAllComments, setShowAllComments] = useState(false);

  // Determine which comments to display based on showAllComments state
  const commentsToDisplay = showAllComments
    ? post.comments
    : post.comments.slice(0, 4); // Show only first 4 comments by default

  const [isLiked, setIsLiked] = useState(
    currentLoggedInUser
      ? post.likes.some(
          (like) => like.username === currentLoggedInUser.username
        )
      : false
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const [editingComment, setEditingComment] = useState<{
    commentId: string;
    commentIndex: number;
    originalText: string;
  } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };
  const [commenting, isCommenting] = useState<boolean>(false);
  const handleAddComment = async (postId: string) => {
    isCommenting(true);
    const newCommentText = commentInputs[postId]?.trim();
    if (newCommentText && currentLoggedInUser) {
      try {
        const response = await useCommentApi.createComment(
          postId,
          newCommentText
        );

        if (response.status === 200 && response.data) {
          isCommenting(false);
          const newComment = {
            _id: response.data._id,
            content: response.data.content,
            owner: response.data.owner || {
              _id: currentLoggedInUser.id,
              username: currentLoggedInUser.username,
            },
            createdAt: response.data.createdAt,
          };
          post.comments.push(newComment);
          setCommentInputs((prev) => ({
            ...prev,
            [postId]: "",
          }));
          // After adding a new comment, ensure all comments are shown
          setShowAllComments(true);
        } else {
          isCommenting(false);
          console.error(
            "API did not return a valid comment object or status was not 200:",
            response
          );
        }
      } catch (error) {
        isCommenting(false);
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLike = async () => {
    setIsLiked(true);
    if (!currentLoggedInUser) {
      // console.log("User not logged in. Cannot like.");
      toast.error("You must be logged in to like a post.");
      return;
    }

    try {
      const response: any = await useLikeApi.likePost(post._id);
      // console.log("Like API response:", response);

      if (response.status === 200) {
        if (response.message === "Post liked successfully") {
          setLikesCount((prev) => prev + 1);
        } else if (response.message === "Post unliked successfully") {
          setIsLiked(false);
          setLikesCount((prev) => prev - 1);
        }
      } else {
        console.error("API returned an error:", response.message);
        setIsLiked(false);
      }
    } catch (error) {
      setIsLiked(false);
      console.error("Error liking post:", error);
    }
  };

  const handleEditComment = (postId: string, index: number, text: string) => {
    setEditingComment({ postId, commentIndex: index, originalText: text });
    setEditCommentText(text);
  };

  const handleSaveEdit = async () => {
    if (editingComment) {
      const { commentId, commentIndex, originalText } = editingComment;
      const newContent = editCommentText.trim();

      if (!newContent) {
        toast.error("Comment cannot be empty.");
        return;
      }

      if (newContent === originalText) {
        toast.info("No changes made to the comment.");
        setEditingComment(null);
        setEditCommentText("");
        return;
      }

      try {
        // Call the API to update the comment
        const response = await useCommentApi.updateComment(
          commentId,
          newContent
        );

        if (response.status === 200 && response.data) {
          // Update the local state with the new content and mark as edited
          // This directly modifies the 'post' prop's comments array.
          // In a real application, you might want to pass a callback to update the parent's state.
          if (post.comments[commentIndex]) {
            post.comments[commentIndex] = {
              ...post.comments[commentIndex],
              content: response.data.content,
              edited: true,
              createdAt: response.data.createdAt || dayjs().toISOString(),
            };
            // Force a re-render to reflect the change if not automatically happening
            // by updating a dummy state or by using a key change.
            // For now, assuming direct modification will work with React's reconciliation.
            // A better way would be to create a new array and set it.
            // setDisplayedComments([...post.comments]); // If using local state for comments
          }
          toast.success("Comment updated successfully!");
        } else {
          toast.error(response.message || "Failed to update comment.");
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        toast.error("An error occurred while updating the comment.");
      } finally {
        setEditingComment(null);
        setEditCommentText("");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (commentId: string, index: number) => {
    try {
      const response = await useCommentApi.deleteComment(commentId);
      if (response.status === 200) {
        // Remove the comment from the local array
        post.comments.splice(index, 1); // Directly modify the prop for simplicity
        // setDisplayedComments([...post.comments]); // If using local state for comments
        toast.success("Comment deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment.");
    }
  };

  // Helper to check if a string is non-empty
  const isValidId = (id?: string) => id && id.length > 0;

  return (
    <Card
      key={post._id}
      className="border-0 border-b md:border rounded-none md:rounded-lg shadow-none md:shadow-sm bg-white"
    >
      <div className="flex items-center justify-between p-3 md:p-4">
        <User post={post} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save</DropdownMenuItem>
            {/* Conditionally render ReportModal for post */}
            {isValidId(session?.user?.id) && isValidId(post.owner?._id) && (
              <ReportModal
                reportedBy={session.user.id}
                relatedPostId={post._id}
                reportedUser={post.owner._id}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Report
                </DropdownMenuItem>
              </ReportModal>
            )}
            <DropdownMenuItem>Unfollow</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="ml-6">{post.caption}</div>

      {post.image && post.image.length > 0 && (
        <CardContent className="p-0 relative">
          <GridMedia media={post.image} />
        </CardContent>
      )}
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={handleLike}
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0"
              onClick={() => toggleComments(post._id)}
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

        <div className="font-semibold text-sm mb-2">
          {likesCount.toLocaleString()} likes
        </div>

        <div className="space-y-1">
          {commentsToDisplay.map((comment, index) => (
            <div
              key={comment._id || `initial-comment-${index}`}
              className="text-sm group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`person/${
                      comment?.owner?.username ? comment?.owner?._id : "/me"
                    }`}
                    className="font-semibold mr-2"
                  >
                    {comment?.owner?.username || session?.user?.username}
                  </Link>
                  {editingComment?.postId === post._id &&
                  editingComment?.commentIndex === index ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        // Removed autoFocus as per user request to avoid focusing
                      />
                      <div className="flex gap-2 mt-1">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="h-6 px-2 text-xs"
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
                      {comment.content}
                      {(comment as any).edited && (
                        <span className="text-xs text-gray-400 ml-1">
                          (edited)
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-2">
                        {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </>
                  )}
                </div>
                {/* Check if the comment owner is the current logged-in user for edit/delete options */}
                {currentLoggedInUser &&
                  comment.owner?.username === currentLoggedInUser.username &&
                  !(
                    editingComment?.postId === post._id &&
                    editingComment?.commentIndex === index
                  ) && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditComment(
                                post._id,
                                index,
                                comment.content
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteComment(comment._id, index)
                            } // Pass comment._id
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                {/* Conditionally render ReportModal for comment */}
                {comment.owner?.username !== currentLoggedInUser.username &&
                  isValidId(session?.user?.id) &&
                  isValidId(comment.owner?._id) &&
                  !(
                    editingComment?.postId === post._id &&
                    editingComment?.commentIndex === index
                  ) && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ReportModal
                            reportedBy={session.user.id}
                            reportedUser={comment.owner._id}
                            relatedPostId={post._id}
                            relatedCommentId={comment._id}
                          >
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Report
                            </DropdownMenuItem>
                          </ReportModal>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteComment(comment._id, index)
                            } // Pass comment._id
                            className="text-red-600"
                          >
                            Unfollow
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
              </div>
            </div>
          ))}

          {/* "View all comments" / "Hide comments" button */}
          {post.comments.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAllComments(!showAllComments);
                // Also toggle the comment input field visibility when "View all comments" is clicked
                // If showing all comments, also show the input field
                setShowComments((prev) => ({
                  ...prev,
                  [post._id]: !showAllComments,
                }));
              }}
              className="text-xs text-gray-500 mt-1 h-auto p-0"
            >
              {showAllComments
                ? "Hide comments"
                : `View all ${post.comments.length} comments`}
            </Button>
          )}

          {showComments[post._id] && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={
                      currentLoggedInUser?.image ||
                      "/placeholder.svg?height=24&width=24"
                    }
                  />
                  <AvatarFallback>
                    {currentLoggedInUser?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      handleCommentInputChange(post._id, e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddComment(post._id)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!currentLoggedInUser} // Disable if not logged in
                    // Removed autoFocus as per user request to avoid focusing
                  />
                  {commentInputs[post._id]?.trim() &&
                    currentLoggedInUser && ( // Only show post button if logged in
                      <Button
                        onClick={() => handleAddComment(post._id)}
                        size="sm"
                        disabled={commenting}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50"
                      >
                        {commenting ? "posting..." : "post"}
                      </Button>
                    )}
                </div>
              </div>
              {!currentLoggedInUser && (
                <p className="text-xs text-red-500 mt-2">
                  Please log in to add comments.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}