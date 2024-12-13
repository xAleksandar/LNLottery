import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your backend URL

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (userId) {
      // Establish connection
      socketRef.current = io(SOCKET_SERVER_URL);

      // Emit userId to the server
      socketRef.current.emit("connect_event", userId); // 'connect_event' should match your server's GatewayEvents.Connect

      // Listen for events (example: balance update)
      socketRef.current.on("balance_update", (balance: number) => {
        console.log("Updated balance:", balance);
      });

      // Cleanup on component unmount
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [userId]);

  return socketRef.current;
};
