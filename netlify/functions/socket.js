import { Server } from "ws";

let wss;

export default async (req, res) => {
  if (!wss) {
    wss = new Server({ noServer: true });

    console.log("✅ WebSocket server pokrenut");

    // Osluškuje i loguje kada se neko poveže
    wss.on("connection", (ws) => {
      console.log("🔌 Novi klijent povezan!");
      ws.send(JSON.stringify({ message: "Dobrodošao na TikTok Live Leaderboard!" }));
    });
  }

  if (req.url === "/.netlify/functions/socket" && req.method === "GET") {
    if (req.socket.server.wss) {
      res.statusCode = 400;
      res.end("WebSocket već aktivan");
      return;
    }

    req.socket.server.wss = wss;

    req.socket.server.on("upgrade", (request, socket, head) => {
      if (request.url === "/.netlify/functions/socket") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    });

    res.statusCode = 200;
    res.end("WebSocket aktivan");
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
};
