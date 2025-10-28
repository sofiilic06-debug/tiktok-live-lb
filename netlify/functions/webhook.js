export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    // Kada TikTok pošalje "challenge", moraš da ga vratiš
    if (body?.challenge) {
      return {
        statusCode: 200,
        body: JSON.stringify({ challenge: body.challenge }),
      };
    }

    console.log("TikTok Event:", body);

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }
}
