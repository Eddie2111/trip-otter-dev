import { runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import commentsSchema from "@/utils/schema/comments-schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import likeSchema from "@/utils/schema/like-schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Comment schema imported:", commentsSchema);
  console.log("Likes model registered:", !!mongoose.models.Like);
  console.log("Comment model registered:", !!mongoose.models.Comment);
  const searchParams = request.nextUrl.searchParams;
  const emailId = searchParams.get("id");
  if (emailId) {
    const posts = await runDBOperationWithTransaction(async () => {
      const posts = await postsSchema
        .find()
        .sort({ createdAt: -1 })
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
    });
    return Response.json({
      message: "Received feed data",
      status: 200,
      data: posts,
    });
  } else {
    const posts = await runDBOperationWithTransaction(async () => {
    return await postsSchema
      .find()
      .sort({ createdAt: -1 })
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
        }]

      )
      .lean();
    });
    return Response.json({
      message: "Received feed data",
      status: 200,
      data: posts,
    });
  }
}
  
export async function POST(request: Request) {
    return Response.json({
        message: "Hello World",
        status: 200,
        method: request.method,
    })
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
