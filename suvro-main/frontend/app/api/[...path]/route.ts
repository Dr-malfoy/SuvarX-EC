import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  let targetUrl = "";
  try {
    const { path = [] } = await params;
    const subPath = path.join("/");
    const search = request.nextUrl.search || "";
    const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
    targetUrl = `${baseUrl}/api/${subPath}${search}`;

    const reqHeaders: Record<string, string> = {
      "Accept": "application/json, text/plain, */*",
    };

    const contentType = request.headers.get("content-type");
    if (contentType) reqHeaders["Content-Type"] = contentType;

    const auth = request.headers.get("authorization");
    if (auth) reqHeaders["Authorization"] = auth;

    const isBodyAllowed = !["GET", "HEAD"].includes(request.method);
    const body = isBodyAllowed ? await request.text() : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: reqHeaders,
      body,
      cache: "no-store",
    });

    const responseData = await response.text();
    const contentTypeHeader = response.headers.get("content-type") || "application/json";

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        "Content-Type": contentTypeHeader,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Proxy Error";
    console.error(`[API Proxy Error] Failed to reach backend at ${targetUrl}:`, message);

    return NextResponse.json(
      {
        success: false,
        message: `Backend API Gateway Error (${message})`,
        targetUrl,
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
