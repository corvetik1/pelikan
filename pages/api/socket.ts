import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket } from "net";
import { Server as IOServer } from "socket.io";
import type { Server as IOServerType } from "socket.io";

// Extend the Next.js server to store a Socket.IO instance
import type { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServerType;
    };
  };
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing so that Next.js leaves the request untouched
  },
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponseServerIO
): void {
  // If Socket.IO server is already running, do nothing
  if (res.socket.server.io) {
    res.end();
    return;
  }

  // Create new Socket.IO server and attach to underlying HTTP server
  const io = new IOServer(res.socket.server, {
    path: "/api/socket", // Clients must connect with this path
    addTrailingSlash: false,
  });

  // Basic connection log – extend as needed
  io.on("connection", (socket) => {
    console.log("⚡️ New client connected", socket.id);

    socket.on("disconnect", () => {
      console.log("👋 Client disconnected", socket.id);
    });
  });

  // Store instance so that we don't  create multiple servers during hot reloads
  res.socket.server.io = io;
  res.end();
}
