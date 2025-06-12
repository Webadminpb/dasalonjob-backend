import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Record<string, string> = {};

  handleConnection(client: any, ...args: any[]) {
    const userId = client.handshake.query.userId;
    console.log('client query ', client.handshake.query.userId);
    if (userId) this.clients[userId] = client.id;
  }

  handleDisconnect(client: any) {
    const userId = Object.keys(this.clients).find(
      (key) => this.clients[key] === client.id,
    );
    if (userId) delete this.clients[userId];
  }

  sendToUser(userId: string, payload: any) {
    const socketId = this.clients[userId];
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
    }
  }

  broadCast(payload: any) {}
}
