import { Server } from "socket.io";

if (!globalThis.io) {
  globalThis.io = new Server(3000, { cors: { origin: "*" } });
}

export default async (req, res) => {
  try {
    // Primi TikTok event
    const body = await req.json();
    console.log("🎁 Primljen TikTok event:", body);

    // Pošalji svim klijentima putem Socket.io
    globalThis.io.emit("tiktok_event", body);

    // Vrati TikToku odgovor da je primljeno
    return new Response(
      JSON.stringify({ status: "success", received: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Greška u webhooku:", err);
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
