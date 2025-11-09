import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  });

  io.on('connection', (socket: any) => {
    const authUserId = socket.handshake.auth?.userId;
    const queryUserId = socket.handshake.query?.userId;
    const userId = authUserId || queryUserId;

    if (userId) {
      const room = `user:${userId}`;
      socket.join(room);
    }
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('socket_not_initialized');
  }
  return io;
}

export function emitToUser(userId: number | string, event: string, payload: unknown) {
  if (!io) {
    return;
  }
  io.to(`user:${userId}`).emit(event, payload);
}

