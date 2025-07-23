// src/socket.js
import { io } from "socket.io-client";

let socket = null;


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


export function getSocket() {
  if (!socket) {
    throw new Error("Socket not connected! Call connectSocket(token) first.");
  }
  return socket;
}
