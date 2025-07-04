// File: pages/api/connect/tiktok.ts

import type { NextApiRequest, NextApiResponse } from "next";

type TikTokProxyResponse = {
  error?: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TikTokProxyResponse | string>
) {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({ error: "Missing TikTok authorization code" });
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

    const data = await backendResponse.json();

    return res.status(200).send(`<!DOCTYPE html>
<html>
  <body>
    <script>
      window.opener.postMessage({ success: true, provider: 'tiktok' }, '*');
      window.close();
    </script>
    <p>You're connected! You can close this window.</p>
  </body>
</html>`);
  } catch (err: any) {
    console.error("TikTok Proxy Error:", err);
    return res.status(500).json({
      error: "Proxy failed",
      details: err.message || "Unknown error",
    });
  }
}
