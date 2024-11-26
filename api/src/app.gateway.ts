import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayEvents } from '../../constants/gateway.constants';

@WebSocketGateway()
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // Mapping of user IDs to their socket instances
  private userSockets: Map<string, Socket> = new Map();

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.emit('connection', 'Welcome to LN Gateway');
    });
  }

  @SubscribeMessage(GatewayEvents.Connection)
  onNewMessage(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.userSockets.set(userId, client);
  }

  emitBalanceUpdate(userId: string, balance: number): void {
    const userSocket = this.userSockets.get(userId);
    if (userSocket) {
      userSocket.emit(GatewayEvents.BalanceUpdate, balance);
    }
  }
}
