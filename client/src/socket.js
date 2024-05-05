import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://c46-group-a-f3ebdee28d59.herokuapp.com/"
    : "http://localhost:3000";

export const socket = io(URL);
