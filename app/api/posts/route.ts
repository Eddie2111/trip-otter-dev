import { runDBOperation, runDBOperationWithTransaction } from "@/lib/useDB";
import postsSchema from "@/utils/schema/posts-schema";
import profileSchema from "@/utils/schema/profile-schema";

export async function GET(request: Request) {
    return Response.json({
        message: "Hello World",
        status: 200,
        method: request.method,
    })
}
  
export async function POST(request: Request) {
    const postBody = await request.json()
    try {
        const createPost = await runDBOperationWithTransaction(async () => {
            const newPost = new postsSchema(postBody);
            await newPost.save();
      
            const updateResult = await profileSchema.findOneAndUpdate(
              { user: postBody.owner },
              { $push: { posts: newPost._id } },
              { new: true, upsert: true,}
            );
      
            return {newPost, updateResult};
          });
        return Response.json({
            message: "Post uploaded!",
            status: 200,
            data: createPost,
        })
    } catch (error: unknown) {
        const errResponse = error as {message: string; code: number};
        return Response.json({
            message: "Error uploading post",
            status: 500,
            error: errResponse.message,
        })
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
