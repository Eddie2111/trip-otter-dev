export async function GET(request: Request) {
    return Response.json({
        message: "Hello World",
        status: 200,
        method: request.method,
    })
}
  
export async function POST(request: Request) {
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