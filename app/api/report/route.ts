import { authOptions } from '@/auth';
import { runDBOperation, runDBOperationWithTransaction } from '@/lib/useDB';
import { reportSchema as reportSchemaValidator } from '@/utils/models/report.model';
import profileSchema from '@/utils/schema/profile-schema';
import reportSchema from '@/utils/schema/report-schema';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = await getServerSession(authOptions);
  if (!userId?.user?.id) return Response.json({
    message: "Unauthorized",
    status: 401,
  })
  const reportId = searchParams.get("id");
  const response = await runDBOperation(async () => { 
    if (reportId) {
      return await reportSchema.findById(reportId);
    } else {
      return await reportSchema.find({ _id: reportId });
  }})
  return Response.json({
    message: "Report fetched",
    status: 200,
    data: response
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
  const response = await runDBOperationWithTransaction(async () => {
    const report = new reportSchema(payload.data);
    const profile = await profileSchema.findByIdAndUpdate(userId.user.id, { $push: { reports: report._id } }, { new: true });
    const reportResponse = await report.save();
    return { profile, reportResponse }
  })
    return Response.json({
      message: "Report created",
      status: 200,
      data: response
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
