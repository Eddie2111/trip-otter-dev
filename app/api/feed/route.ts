// import { runDBOperationWithTransaction } from "@/lib/useDB";
// import postsSchema from "@/utils/schema/posts-schema";
// import mongoose from 'mongoose';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import commentsSchema from "@/utils/schema/comments-schema";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import likeSchema from "@/utils/schema/like-schema";
// import { NextRequest } from "next/server";


import { runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import commentsSchema from "@/utils/schema/comments-schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import likeSchema from "@/utils/schema/like-schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Comment schema imported:", commentsSchema);
  console.log("Likes model registered:", !!mongoose.models.Like);
  console.log("Comment model registered:", !!mongoose.models.Comment);

  const searchParams = request.nextUrl.searchParams;
  const emailId = searchParams.get("id");

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 posts per page
  const skip = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await runDBOperationWithTransaction(
      async () => {
        // Build the base query
        let query = postsSchema.find();

        // If emailId is provided, filter by owner
        if (emailId) {
          // Assuming emailId can be used to find the owner's _id.
          // You might need to fetch the user by emailId first if it's not the _id.
          // For simplicity, let's assume emailId is the owner's _id or can be directly used.
          // If 'owner' field in postsSchema stores email, this is fine.
          // If 'owner' stores '_id', you'd need to find the user by email first.
          // For now, assuming emailId is the owner's _id for filtering.
          // You might need to adjust this based on your actual user schema and how owner is stored.
          query = query.where("owner", emailId);
        }

        // Get total count before applying skip and limit for pagination metadata
        const totalCount = await postsSchema.countDocuments(query.getQuery()); // Use getQuery() to get the current query conditions

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




// export async function GET(request: NextRequest) {
//   console.log("Comment schema imported:", commentsSchema);
//   console.log("Likes model registered:", !!mongoose.models.Like);
//   console.log("Comment model registered:", !!mongoose.models.Comment);
//   const searchParams = request.nextUrl.searchParams;
//   const emailId = searchParams.get("id");

//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const limit = parseInt(searchParams.get("limit") || "10", 10);
//   const skip = (page - 1) * limit;

//   if (emailId) {
//     const posts = await runDBOperationWithTransaction(async () => {
//       const posts = await postsSchema
//         .find()
//         .sort({ createdAt: -1 })
//         .populate([
//           {
//             path: "owner",
//             select: "_id fullName username profileImage",
//           },
//           {
//             path: "likes",
//             model: "User",
//             select: "_id username fullName profileImage",
//           },
//           {
//             path: "comments",
//             model: "Comment",
//             select: "_id content owner createdAt",
//             populate: {
//               path: "owner",
//               model: "User",
//               select: "_id username profileImage",
//             },
//           },
//         ])
//         .lean();
//       return posts;
//     });
//     return Response.json({
//       message: "Received feed data",
//       status: 200,
//       data: posts,
//     });
//   } else {
//     const posts = await runDBOperationWithTransaction(async () => {
//     return await postsSchema
//       .find()
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .populate([
//         {
//           path: "owner",
//           select: "_id fullName username profileImage",
//         },
//         {
//           path: "likes",
//           model: "User",
//           select: "_id username fullName profileImage",
//         },
//         {
//           path: "comments",
//           model: "Comment",
//           select: "_id content owner createdAt",
//           populate: {
//             path: "owner",
//             model: "User",
//             select: "_id username profileImage",
//           },
//         },
//       ])
//       .lean();
//     });
//     return Response.json({
//       message: "Received feed data",
//       status: 200,
//       data: posts,
//     });
//   }
// }
  
// export async function POST(request: Request) {
//     return Response.json({
//         message: "Hello World",
//         status: 200,
//         method: request.method,
//     })
// }

// export async function OPTIONS(request: Request) {
//     return new Response(null, {
//       status: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Max-Age": "86400",
//       },
//     });
// }
