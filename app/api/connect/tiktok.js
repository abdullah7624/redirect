export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing TikTok authorization code" });
  }

  try {
    // Forward to your real backend (like localhost or ngrok)
    const backendResponse = await fetch(
      "https://14c3-2402-ad80-a0-a8fd-a598-f772-2a75-6e8e.ngrok-free.app/api/connect/tiktok",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    const data = await backendResponse.json();

    return res.status(200).send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ success: true, provider: 'tiktok' }, '*');
            window.close();
          </script>
          <p>You're connected! You can close this window.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("TikTok Proxy Error:", err);
    return res
      .status(500)
      .json({ error: "Proxy failed", details: err.message });
  }
}
