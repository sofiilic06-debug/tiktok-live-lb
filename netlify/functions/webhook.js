exports.handler = async (event) => {
  try {
    // TikTok šalje "challenge" prilikom verifikacije
    const body = JSON.parse(event.body || '{}');

    // Ako je challenge event — samo vrati challenge
    if (body && body.challenge) {
      return {
        statusCode: 200,
        body: JSON.stringify({ challenge: body.challenge }),
      };
    }

    // Ako nije test event, samo potvrdi prijem
    console.log("TikTok Event Received:", body);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Webhook error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
