"use server";

import { runDBOperation } from "@/lib/useDB";

import profileSchema from "@/utils/schema/profile-schema";
import userSchema from "@/utils/schema/user-schema";
import mongoose from "mongoose";


import "@/utils/schema/comments-schema";
import "@/utils/schema/like-schema";
import "@/utils/schema/posts-schema";
import { UserDataOptimized } from "./type";

export async function getUserData(userId: string): Promise<UserDataOptimized | boolean> {
  try {
    const data = await runDBOperation(async () => {
      const [user, userProfile] = await Promise.all([
        userSchema
          .findById(userId)
          .select(
            "username fullName profileImage coverImage _id bio location socials email active role createdAt updatedAt"
          )
          .lean()
          .exec() as any,

        profileSchema
          .aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
              $project: {
                _id: 1,
                postsCount: { $size: "$posts" },
                commentsCount: { $size: "$comments" },
                followersCount: { $size: "$followers" },
                followingCount: { $size: "$following" },
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ])
          .exec(),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      const profileCounts = userProfile[0] || {};

      const userData: UserDataOptimized = {
        ...user,
        profile: {
          _id: profileCounts._id,
          postsCount: profileCounts.postsCount || 0,
          commentsCount: profileCounts.commentsCount || 0,
          followersCount: profileCounts.followersCount || 0,
          followingCount: profileCounts.followingCount || 0,
          createdAt: profileCounts.createdAt,
          updatedAt: profileCounts.updatedAt,
        },
      };

      return userData;
    });

    return data;
  } catch (err) {
    console.log("error at endpoint", JSON.stringify(err));
    return false;
  }
}

export async function updateUserData(userId: string, postBody: any): Promise<UserDataOptimized | boolean> {
  if (!userId) {
    return false;
  }
  try {
    const data = await runDBOperation(async () => {
      const user = await userSchema.findByIdAndUpdate(
        { _id: userId },
        { $set: postBody },
        { new: true }
      );
      return user;
    });
    return data;
  } catch (err) {
    console.log("error at endpoint", JSON.stringify(err));
    return false;
  }
}