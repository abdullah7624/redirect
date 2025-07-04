// File: app/api/connect/tiktok/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing TikTok authorization code" },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(
      "https://14c3-2402-ad80-a0-a8fd-a598-f772-2a75-6e8e.ngrok-free.app/api/connect/tiktok",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error: "Backend TikTok handler failed",
          details: result,
        },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head><title>Connected</title></head>
  <body>
    <script>
      window.opener?.postMessage({ success: true, provider: 'tiktok' }, '*');
      window.close();
    </script>
    <p>You're connected! You can close this window.</p>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err: unknown) {
    console.error("TikTok Proxy Error:", err);

    const message =
      err instanceof Error
        ? { message: err.message, stack: err.stack }
        : { raw: JSON.stringify(err) };

    return NextResponse.json(
      {
        error: "Proxy failed",
        ...message,
      },
      { status: 500 }
    );
  }
}
