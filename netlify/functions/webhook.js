// ✅ TikTok Webhook sa challenge proverom i Socket.io emitovanjem (Netlify verzija)
import { Server } from "socket.io";

// 🔹 Jedan globalni server koji ostaje aktivan (Netlify "cold start" fix)
let io;
if (!globalThis.io) {
  io = new Server({
    cors: {
      origin: "*", // dozvoljava tvoj front-end
      methods: ["GET", "POST"],
    },
  });
  globalThis.io = io;
  console.log("🚀 Socket.IO server pokrenut globalno");
} else {
  io = globalThis.io;
}

// 🔹 Glavna funkcija (handler za Netlify funkciju)
export default async (req, res) => {
  try {
    // TikTok šalje GET zahtev sa challenge tokenom (prva verifikacija)
    if (req.method === "GET") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const challenge = url.searchParams.get("challenge");

      if (challenge) {
        console.log("✅ TikTok webhook potvrđen challenge-om:", challenge);
        return new Response(JSON.stringify({ challenge }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // TikTok event POST zahtev
    if (req.method === "POST") {
      const body = await req.json();
      console.log("🎁 Primljen TikTok event:", body);

      // Emituj svim povezanima preko Socket.IO
      io.emit("tiktok_event", body);

      return new Response(
        JSON.stringify({ status: "success", received: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ako metoda nije GET ili POST
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
