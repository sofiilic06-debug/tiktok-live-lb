// ✅ TikTok Webhook sa challenge proverom i Socket.io emitovanjem
import { Server } from "socket.io";

if (!globalThis.io) {
  globalThis.io = new Server(3000, {
    cors: { origin: "*" },
  });
  console.log("✅ Socket.io server pokrenut na portu 3000");
}

export default async (req, res) => {
  try {
    // 1️⃣ Challenge proveru TikTok radi GET metodom
    if (req.method === "GET") {
      const url = new URL(req.url);
      const challenge = url.searchParams.get("challenge");
      if (challenge) {
        console.log("✅ Challenge potvrđen:", challenge);
        return new Response(JSON.stringify({ challenge }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 2️⃣ TikTok event POST
    if (req.method === "POST") {
      const body = await req.json();
      console.log("🎁 Novi TikTok event:", body);

      // Emituj svim povezanim klijentima (tvojoj web aplikaciji)
      globalThis.io.emit("tiktok_event", body);

      return new Response(
        JSON.stringify({ status: "success", received: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Ako je nešto drugo
    return new Response(
      JSON.stringify({ error: "Unsupported method" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Greška u webhook funkciji:", err);
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
