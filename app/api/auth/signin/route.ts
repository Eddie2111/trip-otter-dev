import { loginSchema } from "@/components/login-page";
import { NextRequest } from "next/server";
import { z } from 'zod';

export async function GET(request: Request) {
    return Response.json({
        message: "Hello World",
        status: 200,
        method: request.method,
    })
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = loginSchema.parse(body);
  
      return Response.json({
        message: "Sign-in successful",
        data: validatedData,
        status: 200,
      });
  
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          {
            message: "Validation failed",
            errors: error.errors,
            status: 400,
          },
          { status: 400 }
        );
      }
  
      return Response.json(
        {
          message: "Internal server error",
          status: 500,
        },
        { status: 500 }
      );
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