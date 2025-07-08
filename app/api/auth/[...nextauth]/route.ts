import { authOptions } from "@/auth";
import NextAuth, { AuthOptions } from "next-auth";

export const GET = NextAuth(authOptions as AuthOptions);
export const POST = NextAuth(authOptions as AuthOptions);

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
