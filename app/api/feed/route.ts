import { NextRequest, NextResponse } from "next/server";
import { runDBOperationWithTransaction } from "@/lib/useDB";

import postsSchema from "@/utils/schema/posts-schema";

import "@/utils/schema/comments-schema";
import "@/utils/schema/like-schema";

export async function GET(request: NextRequest) {
  console.log("Comment schema imported:");
  console.log("Likes model registered:");
  console.log("Comment model registered:");

  const searchParams = request.nextUrl.searchParams;
  const profileId = searchParams.get("id");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
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
          ])
          .lean();
        return { posts: fetchedPosts, totalPosts: totalCount };
      }
    );

    return NextResponse.json({
      message: "Received feed data",
      status: 200,
      data: posts,
      pagination: {
        currentPage: page,
        postsPerPage: limit,
        totalPosts: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasMore: page * limit < totalPosts,
      },
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({
      message: `Failed to load posts: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      status: 500,
      data: [],
      pagination: {
        currentPage: 1,
        postsPerPage: limit,
        totalPosts: 0,
        totalPages: 0,
        hasMore: false,
      },
    });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({
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
