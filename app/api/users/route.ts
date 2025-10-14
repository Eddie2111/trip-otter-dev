import { NextRequest } from "next/server";

import mongoose from "mongoose";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { getUserData, updateUserData } from "./users.action";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("id");

    if (!userId?.trim()) {
      return new Response(
        JSON.stringify({ message: "User ID is required", status: 400 }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user ID format", status: 400 }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await getUserData(userId);

    return Response.json({
      message: "User data retrieved successfully",
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage === "User not found" ? 404 : 500;

    return new Response(
      JSON.stringify({
        message: errorMessage,
        status: statusCode,
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const postBody = await request.json();
  const userId = await getServerSession(authOptions);
  const data = await updateUserData(postBody, userId);
  return Response.json({
    message: "Profile Updated!",
    status: 200,
    data,
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
