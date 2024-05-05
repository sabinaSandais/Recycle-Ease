import { io } from "socket.io-client";

export const socket = io(document.location.origin);
