import { io } from "socket.io-client";
import useUserStore from "../store/user.store";
import { GatewayEvents } from "../../../../../constants/gateway.constants";
import { BetDataItem } from "../../../../../types/bets";
import { AvailableNumbers } from "react-casino-roulette";

export const socket = io("http://localhost:3210");

export const initializeWS = (userId: string) => {
  console.log("Initializing WS");
  socket.on(GatewayEvents.Subscribed, (message: string) => {
    console.log(message);
  });

  socket.emit(GatewayEvents.Subscribe, userId);
};

// Listen for WebSocket events and update Zustand store
export const setupWebSocketListeners = () => {
  const { setBalance } = useUserStore.getState(); // Access Zustand actions directly

  socket.on(GatewayEvents.BalanceUpdate, (balance: string) => {
    setBalance(Number(balance)); // Update Zustand store
  });
};

export const onPaymentReceived = (id: string, callback: () => void) => {
  socket.on(GatewayEvents.paymentConfirmed, (paymentId: string) => {
    if (paymentId === id) {
      callback();
    }
  });
};

export const onBetResolved = (callback: (number: AvailableNumbers) => void) => {
  socket.on(GatewayEvents.newBetResolved, (number: AvailableNumbers) => {
    callback(number);
  });
};

export const onBetPlaced = (bets: BetDataItem[]) => {
  const { userId } = useUserStore.getState();
  const data = { userId, bets };
  socket.emit(GatewayEvents.newBetPlaced, data);
};
