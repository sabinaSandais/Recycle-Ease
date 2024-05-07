import { io } from "socket.io-client";

export const socket = io(document.location.origin);
//export const socket = io("http://localhost:3000");
