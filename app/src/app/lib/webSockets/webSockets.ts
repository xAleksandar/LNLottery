import { io } from "socket.io-client";
import useUserStore from "../store/user.store";

const socket = io("http://localhost:3210");

export const initializeWS = (userId: string) => {
  socket.on("subscribed", (message: string) => {
    console.log(message);
  });

  socket.emit("subscribe", userId);
};

// Listen for WebSocket events and update Zustand store
export const setupWebSocketListeners = () => {
  const { setBalance } = useUserStore.getState(); // Access Zustand actions directly

  socket.on("balanceUpdate", (balance: string) => {
    console.log("balanceUpdate", balance);
    setBalance(Number(balance)); // Update Zustand store
  });

  // Add other listeners as needed
  socket.on("paymentConfirmed", (paymentId: string) => {
    console.log("Payment confirmed:", paymentId);
  });
};

export const onPaymentReceived = (id: string, callback: () => void) => {
  console.log("onPaymentReceived called: ", id);
  socket.on(`paymentConfirmed`, (paymentId: string) => {
    console.log("paymentConfirmed event received: ", paymentId);
    if (paymentId === id) {
      console.log("callback activated");
      callback();
    }
  });
};
