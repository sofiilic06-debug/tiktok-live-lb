export default async (req, res) => {
  try {
    const body = req.body ? JSON.parse(req.body) : {};
    console.log("📩 Primljen webhook:", body);

    const event = {
      user: body?.user?.nickname || "Nepoznato",
      gift: body?.gift?.name || "Nepoznato",
      value: body?.gift?.diamond_count || 0,
    };

    // Ako WebSocket server postoji, šaljemo podatak svim konektovanim klijentima
    if (globalThis.wss) {
      globalThis.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(event));
        }
      });
      console.log("📤 Poslato klijentima:", event);
    }

    res.statusCode = 200;
    res.end("OK");
  } catch (err) {
    console.error("❌ Greška u webhook funkciji:", err);
    res.statusCode = 500;
    res.end("Greška na serveru");
  }
};
