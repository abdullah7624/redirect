// ✅ Vercel Proxy - TikTok GET Handler
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  if (!code) {
    return NextResponse.json(
      { error: "Missing TikTok authorization code" },
      { status: 400 }
    );
  }

  try {
    // Replace with your local/ngrok/production backend endpoint
    const backendResponse = await fetch(
      "https://e79789cb6f14.ngrok-free.app/api/connect/tiktok", // 👈 real backend
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, user_email: stateParam }),
      }
    );

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Backend TikTok handler failed", details: result },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(
      `
      <html>
        <body>
          <script>
            window.opener?.postMessage({ success: true, provider: 'tiktok' }, '*');
            window.close();
          </script>
          <p>You're connected! You can close this window.</p>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err) {
    console.error("TikTok Proxy Error:", err);
    return NextResponse.json(
      { error: "Proxy failed", details: err },
      { status: 500 }
    );
  }
}
