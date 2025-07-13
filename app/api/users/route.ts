import { runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import profileSchema from "@/utils/schema/profile-schema";
import userSchema from "@/utils/schema/user-schema";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

// Ensure models are registered
import "@/utils/schema/comments-schema";
import "@/utils/schema/like-schema";

interface UserData {
  _id: string;
  username?: string;
  fullName?: string;
  profileImage?: string;
  profile: {
    posts: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("id");

    if (!userId?.trim()) {
      return new Response(
        JSON.stringify({ message: "User ID is required", status: 400 }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user ID format", status: 400 }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await runDBOperationWithTransaction(async () => {
      // Parallel execution for better performance
      const [user, userProfile] = await Promise.all([
        userSchema.findById(userId).lean().exec() as any,
        profileSchema.findOne({ user: userId }).lean().exec() as any,
      ]);

      if (!user) {
        throw new Error("User not found");
      }
      if (!userProfile) {
        throw new Error("Profile not found");
      }

      let posts: any[] = [];

      // Only fetch posts if profile exists and has posts
      if (userProfile?.posts?.length > 0) {
        posts = await postsSchema
          .find({ _id: { $in: userProfile.posts } })
          .sort({ createdAt: -1 })
          .populate([
            {
              path: "owner",
              model: "User",
              select: "_id username fullName profileImage bio location role",
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
                select: "_id username profileImage fullName",
              },
            },
          ])
          .lean()
          .exec();
      }

      // Construct response data efficiently
      const userData: UserData = {
        ...user,
        profile: {
          ...userProfile,
          posts,
        },
      };

      return userData;
    });

    return Response.json({
      message: "User data retrieved successfully",
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage === "User not found" ? 404 : 500;

    return new Response(
      JSON.stringify({
        message: errorMessage,
        status: statusCode,
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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
