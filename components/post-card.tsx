"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { Loading } from "./ui/loading";
import { useCommentApi, useLikeApi } from "@/lib/requests";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { IPostProps } from "@/types/post";
import GridMedia from "./grid-media";
import { toast } from "sonner";
import { PostDialog } from "./post-dialog";
import { ReportModal } from "./report-modal";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
const POSTS_PER_PAGE = 10;

export function PostContainer({ profileId }: { profileId: string }) {
  const [posts, setPosts] = useState<IPostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [retryCount, setRetryCount] = useState<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const getFeed = useCallback(
    async (currentPage: number, currentRetry: number = 0) => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Only show full loading spinner for initial load or if there are no posts yet
      if (currentPage === 1 && posts.length === 0) {
        setLoading(true);
      } else if (hasMore) {
        // For subsequent pages, show a smaller loading indicator (managed by IntersectionObserver)
        setLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(
          `/api/feed?id=${profileId}&page=${currentPage}&limit=${POSTS_PER_PAGE}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setPosts((prevPosts) => {
            // Filter out duplicates to avoid issues if the same post is returned
            const newPosts = result.data.filter(
              (newItem: IPostProps) =>
                !prevPosts.some((prevItem) => prevItem._id === newItem._id)
            );
            return [...prevPosts, ...newPosts];
          });
          setHasMore(result.pagination.hasMore);
          setRetryCount(0); // Reset retry count on successful fetch
        } else {
          throw new Error(`API error: ${result.message || "Unknown error"}`);
        }
      } catch (err) {
        const errorMessage = `Failed to load posts: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMessage);
        console.error("Error fetching feed:", errorMessage);

        if (currentRetry < MAX_RETRIES) {
          console.log(
            `Retrying fetch in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${
              currentRetry + 1
            }/${MAX_RETRIES})`
          );
          setRetryCount(currentRetry + 1);
          retryTimeoutRef.current = setTimeout(() => {
            getFeed(currentPage, currentRetry + 1);
          }, RETRY_DELAY_MS);
        } else {
          console.log("Max retries reached. Stopping attempts.");
          setLoading(false); // Stop loading if max retries reached
        }
      } finally {
        // Ensure loading is set to false once the fetch attempt (including retries) is complete
        if (currentRetry >= MAX_RETRIES || !retryTimeoutRef.current) {
          setLoading(false);
        }
      }
    },
    // IMPORTANT FIX: Removed `posts.length` and `hasMore` from dependencies.
    // `getFeed` only needs to be re-created if `profileId` changes.
    // `setPosts` uses a functional update to get the latest `prevPosts`.
    // `hasMore` is read as a state variable inside the IntersectionObserver.
    [profileId]
  );

  // Initial fetch for the first page
  useEffect(() => {
    getFeed(1);
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [getFeed]); // Depend on getFeed to re-run if profileId changes

  // Effect for infinite scrolling using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the observer target is intersecting, there's more data,
        // and not currently loading or in an error state, increment page.
        if (entries[0].isIntersecting && hasMore && !loading && !error) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the target is visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore, error]); // Dependencies ensure observer reacts to these states

  // Effect to fetch new data when page number changes
  useEffect(() => {
    if (page > 1) {
      // Only fetch if page is greater than 1 (initial fetch is handled by the first useEffect)
      getFeed(page);
    }
  }, [page, getFeed]); // Depend on page and a stable getFeed

  // Show full-page loading spinner only if no posts have been loaded yet
  if (loading && posts.length === 0) {
    return <Loading />;
  }

  // Show error message if initial load failed after max retries
  if (error && posts.length === 0 && retryCount >= MAX_RETRIES) {
    return (
      <div className="flex justify-center items-center h-48 text-red-600">
        Error: {error}
        <p className="ml-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 md:space-y-6 pb-20 md:pb-0">
      {posts.length > 0
        ? posts.map((postItem) => (
            <PostCard key={postItem._id} post={postItem} session={session} />
          ))
        : // Show "No posts available" only if not loading and no error, and no posts exist
          !loading &&
          !error && (
            <div className="flex justify-center items-center h-48 text-gray-600">
              No posts available.
            </div>
          )}

      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {/* Show loading spinner at the bottom when fetching more posts */}
          {loading && <Loading />}
        </div>
      )}

      {!hasMore && posts.length > 0 && !loading && (
        <div className="flex justify-center py-4 text-gray-500">
          You've reached the end of the posts.
        </div>
      )}

      {error && posts.length > 0 && (
        <div className="flex justify-center mt-6 text-red-600">
          Error loading more posts: {error}
        </div>
      )}
    </div>
  );
}

export function PostCard({
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
  const [displayedComments, setDisplayedComments] = useState(post.comments);

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
          const newComment = {
            _id: response.data._id,
            content: response.data.content,
            owner: response.data.owner || {
              _id: currentLoggedInUser.id,
              username: currentLoggedInUser.username,
            },
            createdAt: response.data.createdAt,
          };
          setDisplayedComments((prevComments) => [...prevComments, newComment]);
          setCommentInputs((prev) => ({
            ...prev,
            [postId]: "",
          }));
          toast.success("Comment added successfully!");
          isCommenting(false);
        } else {
          isCommenting(false);
          console.error(
            "API did not return a valid comment object or status was not 200:",
            response
          );
          toast.error(response.message || "Failed to add comment.");
        }
      } catch (error) {
        isCommenting(false);
        console.error("Error adding comment:", error);
        toast.error("An error occurred while adding the comment.");
      }
    } else if (!newCommentText) {
      isCommenting(false);
      toast.error("Comment cannot be empty.");
    } else if (!currentLoggedInUser) {
      isCommenting(false);
      toast.error("You must be logged in to add a comment.");
    }
  };

  const handleLike = async () => {
    if (!currentLoggedInUser) {
      toast.error("You must be logged in to like a post.");
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response: any = await useLikeApi.likePost(post._id);

      if (response.status === 200) {
      } else {
        setIsLiked(previousIsLiked);
        setLikesCount(previousLikesCount);
        toast.error(response.message || "Failed to update like status.");
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
      console.error("Error liking post:", error);
      toast.error("An error occurred while liking the post.");
    }
  };

  const handleEditComment = (
    commentId: string,
    index: number,
    text: string
  ) => {
    setEditingComment({ commentId, commentIndex: index, originalText: text });
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
        const response = await useCommentApi.updateComment(
          commentId,
          newContent
        );

        if (response.status === 200 && response.data) {
          setDisplayedComments((prev) => {
            const updatedComments = [...(prev || [])];
            if (updatedComments[commentIndex]) {
              updatedComments[commentIndex] = {
                ...updatedComments[commentIndex],
                content: response.data.content,
                edited: true,
                createdAt: response.data.createdAt || dayjs().toISOString(),
              };
            }
            return updatedComments;
          });
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
        setDisplayedComments((prev) => {
          const updatedComments = [...(prev || [])];
          updatedComments.splice(index, 1);
          return updatedComments;
        });
        toast.success("Comment deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment.");
    }
  };

  return (
    <Card
      key={post._id}
      className="border-0 border-b md:border rounded-none md:rounded-lg shadow-none md:shadow-sm bg-white"
    >
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post?.owner?._id}`}>
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarImage
                src={post?.owner?.profileImage || "/placeholder.svg"}
                alt={post?.owner?.username}
              />
              <AvatarFallback>
                {post?.owner?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post?.owner?._id}`}>
              <span className="font-semibold text-sm md:text-base">
                @{post?.owner?.username}
              </span>
            </Link>
            <div className="text-xs text-gray-500">
              {dayjs(post.createdAt).fromNow()}
              {post?.location && ` • ${post?.location}`}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <PostDialog
                post={{ _caption: post.caption, _location: post.location }}
                id={post._id}
                type={"EDIT"}
              >
                <Button variant="ghost">Edit Post</Button>
              </PostDialog>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <PostDialog id={post._id} type={"DELETE"}>
                <Button variant="ghost" className=" text-red-600">
                  Delete Post
                </Button>
              </PostDialog>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/post/${post._id}?caption=${post.caption
                  .split(/ /g)
                  .slice(0, 8)
                  .join("-")}`}
              >
                Show post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ReportModal
                reportedBy={session?.user?.id ?? ""}
                reportedUser={post?.owner?._id ?? ""}
                relatedPostId={post?._id ?? ""}
              >
                <div className="border-0">Report </div>
              </ReportModal>
            </DropdownMenuItem>
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
          {displayedComments.map((comment, index) => (
            <div
              key={comment._id || `initial-comment-${index}`}
              className="text-sm group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-semibold mr-2">
                    {comment.owner?.username || session?.user?.username}
                  </span>
                  {editingComment?.commentId === comment._id &&
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
                        autoFocus
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
                {currentLoggedInUser &&
                  comment.owner?.username === currentLoggedInUser.username &&
                  !(
                    editingComment?.commentId === comment._id &&
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
                                comment._id,
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
                            }
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
              </div>
            </div>
          ))}

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
                    disabled={!currentLoggedInUser}
                  />
                  {commentInputs[post._id]?.trim() && currentLoggedInUser && (
                    <Button
                      onClick={() => handleAddComment(post._id)}
                      size="sm"
                      disabled={commenting}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-7 px-3 text-xs bg-blue-500 hover:bg-blue-600 rounded-full p-5 transition duration-300 ease-in-out disabled:bg-blue-500/50"
                    >
                      {commenting ? "Posting..." : "Post"}
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

          {!showComments[post._id] && displayedComments.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post._id)}
              className="text-xs text-gray-500 mt-1 h-auto p-0"
            >
              View all {displayedComments.length} comments
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
