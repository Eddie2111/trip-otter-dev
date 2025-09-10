"use server";

import { runDBOperationWithTransaction } from "@/lib/useDB";

import postsSchema from "@/utils/schema/posts-schema";

import "@/utils/schema/comments-schema";
import "@/utils/schema/like-schema";
import "@/utils/schema/tribes-schema";

export async function getPublicFeed(
  profileId: string,
  skip: number,
  limit: number
) {
  const { posts, totalPosts } = await runDBOperationWithTransaction(
    async () => {
      let query = postsSchema.find();

      if (profileId) {
        query = query.where("owner", profileId);
      }

      const totalCount = await postsSchema.countDocuments(query.getQuery());

      const fetchedPosts = await query
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "owner",
            select: "_id fullName username profileImage",
          },
          {
            path: "likes",
            model: "User",
            select: "_id username fullName profileImage",
          },
          {
            path: "comments",
            model: "Comment",
            select: "_id content owner createdAt",
            populate: {
              path: "owner",
              model: "User",
              select: "_id username profileImage",
            },
          },
          {
            path: "fromGroup",
            model: "Tribe",
            select: "_id name serial",
          },
        ])
        .lean();
      return { posts: fetchedPosts, totalPosts: totalCount };
    }
  );
  return { posts, totalPosts };
}
