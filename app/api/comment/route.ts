import { authOptions } from "@/auth";
import RateLimiter_Middleware from "@/lib/rate-limiter.middleware";
import { runDBOperation, runDBOperationWithTransaction } from "@/lib/useDB";
import commentsSchema from "@/utils/schema/comments-schema";
import postsSchema from "@/utils/schema/posts-schema";
import profileSchema from "@/utils/schema/profile-schema";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");
    const commentsData = await runDBOperation(async () => {
        const comments = await postsSchema.findById({ id: postId }).populate("comments").exec();
        return comments;
    })
    return Response.json({
        message: "Retrieved comments",
        status: 200,
        data: commentsData,
    })
}
  
export async function POST(request: Request) {
    const userData = await getServerSession(authOptions);
    const userId = userData?.user?.id;
    await RateLimiter_Middleware(request);
    try {
        const postBody = await request.json();
        const { content, post } = postBody;
        const owner = userId;
        const newComment = await runDBOperationWithTransaction(async () => { 
            const comment = new commentsSchema({ content, owner, post });
            const postUpdate = await postsSchema.findByIdAndUpdate(post, { $push: { comments: comment._id } });
            const profileUpdate = await profileSchema.findByIdAndUpdate(owner, { $push: { comments: comment._id } });
            await comment.save();
            return comment;
        })
        return Response.json({
            message: "Posted comment",
            status: 200,
            data: newComment,
        })
    } catch (err) {
        return Response.json({
            message: "Error posting comment",
            status: 500,
            data: err,
        })
    }
    
}

export async function DELETE(request: Request) {
    const postBody = await request.json();
    const { id } = postBody;
    const deletedComment = await runDBOperationWithTransaction(async () => { 
        const comment = await commentsSchema.findByIdAndDelete(id);
        return comment;
    })
    return Response.json({
        message: "Comment deleted",
        status: 200,
        data: deletedComment,
    })
}

export async function PATCH(request: Request) {
    const postBody = await request.json();
    const { id, content } = postBody;
    const updatedComment = await runDBOperationWithTransaction(async () => { 
        const comment = await commentsSchema.findByIdAndUpdate(id, { content }, { new: true });
        return comment;
    })
    return Response.json({
        message: "Comment updated",
        status: 200,
        data: updatedComment,
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
