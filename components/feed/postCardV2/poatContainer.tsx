"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { IPostProps } from "@/types/post";
import { Loading } from "@/components/ui/loading";
import { PostCardV2 } from "./postCard";

export function PostContainer() {
  const [posts, setPosts] = useState<IPostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(10); // Default to 10 posts per page
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Ref for the element to observe for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  const getFeed = useCallback(async (page: number, limit: number) => {
    if (page === 1) {
      setLoading(true); // Show full loading spinner for the first page
    } else {
      setLoadingMore(true); // Show loading indicator for subsequent pages
    }
    try {
      const response = await fetch(`/api/feed?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 200 && result.data) {
        setPosts((prevPosts) => {
          // Filter out duplicates in case of quick scrolling/re-renders
          const newPosts = result.data.filter(
            (newPost: IPostProps) =>
              !prevPosts.some((prevPost) => prevPost._id === newPost._id)
          );
          return [...prevPosts, ...newPosts];
        });
        setHasMore(result.pagination.hasMore);
      } else {
        throw new Error(`API error: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      setError(
        `Failed to load posts: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    getFeed(1, postsPerPage);
  }, [getFeed, postsPerPage]);

  // Infinite scroll logic using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the target is visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loading]); // Depend on hasMore, loadingMore, and loading to re-evaluate observer

  // Fetch new posts when currentPage changes (triggered by observer)
  useEffect(() => {
    if (currentPage > 1) {
      getFeed(currentPage, postsPerPage);
    }
  }, [currentPage, getFeed, postsPerPage]);

  if (loading && posts.length === 0) {
    // Show full loading spinner only if no posts are loaded yet
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-0 md:space-y-6 pb-20 md:pb-0">
      {posts.length > 0 ? (
        posts.map((postItem) => (
          <PostCardV2 key={postItem._id} post={postItem} session={session} />
        ))
      ) : (
        <div className="flex justify-center items-center h-48 text-gray-600">
          No posts available.
        </div>
      )}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center mt-6 p-4">
          {loadingMore && <Loading />}{" "}
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="flex justify-center mt-6 text-gray-500">
          You've reached the end of the feed. How about creating a post?
        </div>
      )}
    </div>
  );
}