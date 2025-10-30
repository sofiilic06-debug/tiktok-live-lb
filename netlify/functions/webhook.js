// ✅ TikTok Webhook sa challenge proverom i Socket.io emitovanjem
import { Server } from "socket.io";

// Inicijalizacija globalnog Socket servera (da ne puca kad Netlify osveži funkciju)
if (!globalThis.io) {
  globalThis.io = new Server(3000, {
    cors: { origin: "*" },
  });
}

export default async (req, res) => {
  try {
    // TikTok šalje challenge GET zahtev prilikom verifikacije webhooka
    if (req.method === "GET") {
      const url = new URL(req.url);
      const challenge = url.searchParams.get("challenge");
      if (challenge) {
        console.log("✅ TikTok webhook potvrđen challenge-om:", challenge);
        return new Response(JSON.stringify({ challenge }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ako nije GET, onda je event POST
    if (req.method === "POST") {
      const body = await req.json();
      console.log("🎁 Primljen TikTok event:", body);

      // Emituj svim klijentima
      globalThis.io.emit("tiktok_event", body);

      return new Response(
        JSON.stringify({ status: "success", received: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ako nije GET ni POST
    return new Response(
      JSON.stringify({ error: "Unsupported method" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Greška u TikTok webhooku:", err);
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
