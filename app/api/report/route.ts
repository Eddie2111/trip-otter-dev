import { authOptions } from '@/auth';
import { reportSchema as reportSchemaValidator } from '@/utils/models/report.model';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reportId = searchParams.get("id");
  const userId = await getServerSession(authOptions);
  if (!userId?.user?.id) return Response.json({
    message: "Unauthorized",
    status: 401,
  })
  return Response.json({
    message: "Report fetched",
    status: 200,
  });
}
  
export async function POST(request: NextRequest) {
  const payload = await request.json();
  const userId = await getServerSession(authOptions);
  if (!userId?.user?.id)
    return Response.json({
      message: "Unauthorized",
      status: 401,
    });
  // const validatedBody = reportSchemaValidator.parse(payload);
    return Response.json({
        message: "Report created",
        status: 200,
    })

}

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reportId = searchParams.get("id");
  const userId = await getServerSession(authOptions);
    if (!userId?.user?.id)
      return Response.json({
        message: "Unauthorized",
        status: 401,
      });
  return Response.json({
      message: "Report updated",
      status: 200,

  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reportId = searchParams.get("id");
  const userId = await getServerSession(authOptions);
    if (!userId?.user?.id)
      return Response.json({
        message: "Unauthorized",
        status: 401,
      });
  return Response.json({
      message: "Report deleted",
      status: 200,
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
