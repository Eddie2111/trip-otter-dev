"use server";

import { runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import profileSchema from "@/utils/schema/profile-schema";
import "@/utils/schema/comments-schema";
import "@/utils/schema/like-schema";
import "@/utils/schema/tribes-schema";

export async function getPublicFeed(
  profileId: string,
  skip: number,
  limit: number
) {
  if (!profileId) {
    // If no profileId is provided, just return public posts
    const { posts, totalPosts } = await runDBOperationWithTransaction(
      async () => {
        const query = postsSchema.find().where("fromGroup", { $exists: false });
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

  const { posts, totalPosts } = await runDBOperationWithTransaction(
    async () => {
      // 1. Fetch the user's profile to get following and tribe IDs
      const profile = await profileSchema
        .findOne({ user: profileId })
        .select("following tribesJoined tribesCreated")
        .lean();

      if (!profile) {
        return { posts: [], totalPosts: 0 };
      }

      // 2. Combine all relevant IDs into a single array
      const followingIds = profile.following.map((id) => id.toString());
      const tribeIds = [
        ...profile.tribesJoined.map((id) => id.toString()),
        ...profile.tribesCreated.map((id) => id.toString()),
      ];

      // 3. Construct the query to find posts
      //    This includes posts from users the profile follows and posts from joined/created tribes.
      const query = postsSchema.find({
        $or: [
          { owner: { $in: followingIds } },
          { fromGroup: { $in: tribeIds } },
        ],
      });

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