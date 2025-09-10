import { NextRequest, NextResponse } from "next/server";
import { getPublicFeed } from "./feed.action";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const profileId = searchParams.get("id");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  if(!profileId) {
    return NextResponse.json({
      message: `Failed to load posts: profile id not provided`,
      status: 400,
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

  try {
    const { posts, totalPosts } = await getPublicFeed(profileId, skip, limit);

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
