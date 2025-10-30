import { Server } from "socket.io";

let io;

export default async (req, res) => {
  if (!io) {
    io = new Server(3000, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Novi klijent:", socket.id);

      socket.on("disconnect", () => {
        console.log("🔴 Klijent se odjavio:", socket.id);
      });
    });
  }

  return new Response(
    JSON.stringify({ status: "Socket server aktivan ✅" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
