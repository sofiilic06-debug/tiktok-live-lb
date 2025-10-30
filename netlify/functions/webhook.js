export default async (req, res) => {
  try {
    // Parse body
    const body = await req.json();

    // ✅ 1. TikTok test verifikacija
    if (body?.challenge) {
      return new Response(JSON.stringify({ challenge: body.challenge }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ 2. Ako je pravi event (gift, comment, live itd)
    if (body?.event) {
      console.log("🎁 TikTok Event:", body);

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ako nije ništa od gore navedenog
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
