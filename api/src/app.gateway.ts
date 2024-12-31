import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UsersService } from './users/users.service';
import { Server, Socket } from 'socket.io';
import { GatewayEvents } from '../../constants/gateway.constants';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // Mapping of user IDs to their socket instances
  private userSockets: Map<string, Socket> = new Map();

  onModuleInit() {}
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage(GatewayEvents.Subscribe)
  async onNewMessage(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.userSockets.set(userId, client);
    client.emit('subscribed', 'Welcome to LN Gateway');
    const balance = await this.usersService.getUserBalance(userId);
    client.emit(GatewayEvents.BalanceUpdate, balance);
  }

  emitInvoicePaymentConfirmed(userId: string, invoiceId: string): void {
    const userSocket = this.userSockets.get(userId);
    if (userSocket) {
      userSocket.emit(GatewayEvents.paymentConfirmed, invoiceId);
    }
  }

  emitNewBalanceUpdate(userId: string, balance: number): void {
    const userSocket = this.userSockets.get(userId);
    if (userSocket) {
      userSocket.emit(GatewayEvents.BalanceUpdate, balance);
    }
  }
}
