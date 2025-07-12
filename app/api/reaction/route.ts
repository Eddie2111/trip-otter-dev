import { authOptions } from "@/auth";
import RateLimiter_Middleware from "@/lib/rate-limiter.middleware";
import { runDBOperation, runDBOperationWithTransaction } from "@/lib/useDB";
import Like from "@/utils/schema/like-schema";
import Post from "@/utils/schema/posts-schema";
import Profile from "@/utils/schema/profile-schema";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get("postId");

  const likesData = await runDBOperation(async () => {
    const post = await Post.findById(postId)
      .populate({
        path: "likes",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .exec();

    return post?.likes || [];
  });

  return Response.json({
    message: "Retrieved likes",
    status: 200,
    data: likesData,
  });
}

export async function POST(request: Request) {
  const userData = await getServerSession(authOptions);
  const userId = userData?.user?.id;

  if (!userId) {
    return Response.json(
      { message: "Unauthorized", status: 401 },
      { status: 401 }
    );
  }

  await RateLimiter_Middleware(request);

  try {
    const body = await request.json();
    const { post: postId } = body;

    const post = await Post.findById(postId).select("likes");

    if (!post) {
      return Response.json(
        { message: "Post not found", status: 404 },
        { status: 404 }
      );
    }

    const hasLiked = post.likes.includes(userId);

    let newLike;
    let message;

    await runDBOperationWithTransaction(async () => {
      if (hasLiked) {
        await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
        await Profile.findOneAndUpdate(
          { user: userId },
          { $pull: { likes: postId } }
        );
        message = "Post unliked";
      } else {
        const like = new Like({ user: userId, post: postId });
        await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
        await Profile.findOneAndUpdate(
          { user: userId },
          { $push: { likes: postId } }
        );
        await like.save();

        newLike = like;
        message = "Post liked";
      }
    });

    return Response.json({
      message,
      status: 200,
      data: hasLiked ? null : newLike,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      message: "Error toggling like",
      status: 500,
      data: err,
    });
  }
}

export async function DELETE(request: Request) {
  const userData = await getServerSession(authOptions);
  const userId = userData?.user?.id;

  if (!userId) {
    return Response.json(
      { message: "Unauthorized", status: 401 },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { postId } = body;

    const deletedLike = await runDBOperationWithTransaction(async () => {
      const like = await Like.findOneAndDelete({ user: userId, post: postId });

      if (!like) {
        throw new Error("Like not found");
      }
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { likes: like._id } }
      );

      return like;
    });

    return Response.json({
      message: "Post unliked",
      status: 200,
      data: deletedLike,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      message: "Error unliking post",
      status: 500,
      data: err,
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
