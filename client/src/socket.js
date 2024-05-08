import { io } from "socket.io-client";
const URL =
  process.env.NODE_ENV === "production"
    ? "https://c46groupa.hackyourfuture.tech"
    : "http://localhost:3000";
//export const socket = io(document.location.origin);
export const socket = io(URL);
