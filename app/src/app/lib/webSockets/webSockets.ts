import { io, Socket } from "socket.io-client";
import useUserStore from "../store/user.store";

const { setBalance } = useUserStore();

const socket = io("http://localhost:3210");

socket.on("balanceUpdate", (balance: string) => {
  console.log("balanceUpdate", balance);
  setBalance(Number(balance));
});

export const initializeWS = (userId: string) => {
  socket.on("subscribed", (message: string) => {
    console.log(message);
  });

  socket.emit("subscribe", userId);
};

export const onPaymentReceived = (id: string, callback: () => void) => {
  socket.on(`paymentConfirmed`, (paymentId: string) => {
    if (paymentId === id) {
      console.log("callback activated");
      callback();
    }
  });
};
