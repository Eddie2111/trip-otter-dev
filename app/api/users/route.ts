import { runDBOperation } from '@/lib/useDB';
import profileSchema from '@/utils/schema/profile-schema';
import userSchema from '@/utils/schema/user-schema';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('id');
    const data = await runDBOperation(async () => {
        let user = await userSchema.findOne({email});
        const userDetails = await profileSchema.findOne({user: user._id});
        user = user.toObject();
        user.profile = userDetails;
        return user;
    });
    return Response.json({
        message: "Hello World",
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
