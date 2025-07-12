import { runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import profileSchema from "@/utils/schema/profile-schema";
import userSchema from "@/utils/schema/user-schema";
import { NextRequest } from "next/server";
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import commentsSchema from "@/utils/schema/comments-schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import likeSchema from "@/utils/schema/like-schema";

export async function GET(request: NextRequest) {
  console.log("Comment schema imported:", commentsSchema);
  console.log("Comment model registered:", !!mongoose.models.Comment);
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("id");
  if (!email) return new Response("Email not provided", { status: 400 });

  const data = await runDBOperationWithTransaction(async () => {
    // get user data
    let user = await userSchema.findOne({ _id: email }).lean();

    if (!user) {
      throw new Error("User not found");
    }

    // get profile data
    const userDetails = await profileSchema.findOne({ user: user._id });
    let posts: any[] = [];

    if (userDetails && userDetails.posts && userDetails.posts.length > 0) {
      posts = await postsSchema
        .find({
          _id: { $in: userDetails.posts },
        })
        .sort({ createdAt: -1 })
        .populate([
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
        ])
        .lean();
    }

    // merge data
    const userData = user.toObject();
    userData.profile = userDetails ? userDetails.toObject() : {};
    userData.profile.posts = posts;

    // return data
    return userData;
  });

  return Response.json({
    message: "User data received",
    status: 200,
    data,
  });
}

export async function POST(request: Request) {
  return Response.json({
    message: "Hello World",
    status: 200,
    method: request.method,
  });
}

export async function PATCH(request: Request) {
  return Response.json({
    message: "Hello World",
    status: 200,
    method: request.method,
  });
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
