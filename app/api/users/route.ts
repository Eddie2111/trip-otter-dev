import { runDBOperation } from '@/lib/useDB';
import profileSchema from '@/utils/schema/profile-schema';
import userSchema from '@/utils/schema/user-schema';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('id');
    if (!email) return new Response('Email not provided', {status: 400});
    const data = await runDBOperation(async () => {
        // get user data
        let user = await userSchema.findOne({_id: email});
        // get profile data
        const userDetails = await profileSchema.findOne({user: user._id});
        // merge data
        user = user.toObject();
        user.profile = userDetails;
        // return data
        return user;
    });
    return Response.json({
        message: "User data received",
        status: 200,
        data
    })
}
  
export async function POST(request: Request) {
    return Response.json({
        message: "Hello World",
        status: 200,
        method: request.method,
    })
}

export async function PATCH(request: Request) {
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
