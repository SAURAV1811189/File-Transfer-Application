// src/socket.js
import { io } from "socket.io-client";

let socket = null;

// Connect socket with token (call this once after login/register)
export function connectSocket(token) {
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: { token },
      });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
}

// Get socket instance (after connection)
export function getSocket() {
  if (!socket) {
    throw new Error("Socket not connected! Call connectSocket(token) first.");
  }
  return socket;
}
