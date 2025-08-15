import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as NetServer } from 'http';
import type { Socket as NetSocket } from 'net';
import { initSocket } from '@/server/socket';
import type { Server as IOServer } from 'socket.io';

// Disable body parsing for WebSocket upgrade
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function socketHandler(req: NextApiRequest, res: NextApiResponse): void {
  // res.socket is added by Next.js (Node.js HTTP server)
  interface SocketWithServer extends NetSocket {
    server: NetServer & { io?: IOServer };
  }

const netSocket = res.socket as SocketWithServer | undefined;
const server = netSocket?.server;
  if (!server) {
    res.status(500).end();
    return;
  }

  // Create Socket.IO server once
  if (!server.io) {
    server.io = initSocket(server);
  }

  res.end();
}
