export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body);

    // Ako TikTok šalje test signal
    if (body.event === "tiktok.ping") {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Ping OK" }),
      };
    }

    // Ako stiže pravi događaj sa lajva
    if (body.event === "gift_send") {
      const gift = JSON.parse(body.content);
      console.log("🎁 Primljen poklon:", gift);

      // Opciono: Pošalji podatke tvojoj web aplikaciji (npr. leaderboard)
      await fetch("https://tvoj-netlify-projekat.netlify.app/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: gift.user_name,
          gift: gift.gift_name,
          value: gift.gift_value,
        }),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
