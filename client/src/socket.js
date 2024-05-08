import { io } from "socket.io-client";

let URL = null;
if (process.env.NODE_ENV === "development") {
  URL = "http://localhost:3000";
}

if (process.env.NODE_ENV === "production") {
  URL =
    process.env.HEROKU_APP_DEFAULT_DOMAIN_NAME ||
    "https://hyf-c46-grou-integrate--63liqp.herokuapp.com";
}

export const socket = io(URL);
