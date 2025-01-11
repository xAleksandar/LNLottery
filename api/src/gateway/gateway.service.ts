import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Messages } from '../../../constants/messages';
import { UsersService } from '../users/users.service';
import { BetsService } from '../services/Bets/bets.service';
import { Server, Socket } from 'socket.io';
import { GatewayEvents } from '../../../constants/gateway.constants';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://10.0.0.100:3000',
      'http://0.0.0.0:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // Mapping of user IDs to their socket instances
  private userSockets: Map<string, Socket> = new Map();

  onModuleInit() {}
  constructor(
    private readonly usersService: UsersService,
    private readonly betsService: BetsService,
  ) {}

  @SubscribeMessage(GatewayEvents.Subscribe)
  async onNewMessage(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.userSockets.set(userId, client);
    client.emit(GatewayEvents.Subscribed, Messages.commonWelcomeToGateway());
    const balance = await this.usersService.getUserBalance(userId);
    client.emit(GatewayEvents.BalanceUpdate, balance);
  }

  @SubscribeMessage(GatewayEvents.newBetPlaced)
  async onNewBetPlaced(
    @MessageBody() data: { userId: string; bets: any },
  ): Promise<void> {
    const betData = await this.betsService.onBetPlaced(data);
    const userSocket = this.userSockets.get(data.userId);
    if (userSocket) {
      userSocket.emit(GatewayEvents.BalanceUpdate, betData.newBalance);
      userSocket.emit(GatewayEvents.newBetResolved, betData.winningNumber);
    }
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
