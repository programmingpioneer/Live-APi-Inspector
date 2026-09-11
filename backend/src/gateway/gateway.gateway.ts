import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { slugSchema } from '../endpoints/endpoints.schema';
import type { CapturedRequest } from '../ingest/types';

/**
 * InspectorGateway
 * ----------------
 * Socket.io namespace: /inspector
 * Rooms: room:<slug>
 * Har slug apna isolated room rakhta hai — ek socket bina interference
 * ke multiple endpoints subscribe kar sakta hai.
 */
@WebSocketGateway({
  namespace: '/inspector',
  cors: { origin: '*', credentials: true },
  transports: ['websocket', 'polling'],
})
export class InspectorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    console.log(`🔌 Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`🔌 Socket disconnected: ${client.id}`);
  }

  /**
   * Client room join karta hai:
   * emit('room:join', { slug: 'abc123' })
   */
  @SubscribeMessage('room:join')
  handleJoinRoom(client: Socket, payload: unknown): { ok: boolean; error?: string } {
    const parsed = slugSchema.safeParse((payload as { slug?: unknown })?.slug);

    if (!parsed.success) {
      return { ok: false, error: 'Invalid slug' };
    }

    const room = `room:${parsed.data}`;
    void client.join(room);
    client.emit('room:joined', { slug: parsed.data });

    return { ok: true };
  }

  /**
   * Client room leave karta hai:
   * emit('room:leave', { slug: 'abc123' })
   */
  @SubscribeMessage('room:leave')
  handleLeaveRoom(client: Socket, payload: unknown): { ok: boolean } {
    const slug = (payload as { slug?: unknown })?.slug;
    if (typeof slug === 'string') {
      void client.leave(`room:${slug}`);
    }
    return { ok: true };
  }

  /** Ingestion ke baad broadcast — sirf room:slug ke listeners ko. */
  emitCapture(slug: string, data: CapturedRequest): void {
    this.server.to(`room:${slug}`).emit('request:captured', data);
  }
}
