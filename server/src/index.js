// Load our .env variables
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();

import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import Machine from "./models/Machine.js";
// Create a server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:8080", // For development
      process.env.HEROKU_APP_DEFAULT_DOMAIN_NAME, // For branches
      "https://c46groupa.hackyourfuture.tech", // For production
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  logInfo(`New user connected with id: ${socket.id}`);
  io.emit("newUser", socket.id);

  socket.on("disconnect", () => {
    logInfo(`A user disconnected with id: ${socket.id} `);
  });
});

// The environment should set the port
const port = process.env.PORT;

if (port == null) {
  // If this fails, make sure you have created a `.env` file in the right place with the PORT set
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

const startServer = async () => {
  try {
    await connectDB();
    const changeStream = Machine.watch();
    changeStream.on("change", (change) => {
      const { documentKey, updateDescription, wallTime } = change;
      let status = updateDescription.updatedFields?.status;
      if (status === 1 || status === 0) {
        const machineId = documentKey._id.toString();
        const status = updateDescription.updatedFields.status;
        const timeStamp = new Date(wallTime).toISOString();
        io.emit("statusChange", { machineId, status, timeStamp });
      }
    });
    server.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
};

/****** Host our client code for Heroku *****/
/**
 * We only want to host our client code when in production mode as we then want to use the production build that is built in the dist folder.
 * When not in production, don't host the files, but the development version of the app can connect to the backend itself.
 */
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  // Redirect * requests to give the client data
  app.get("*", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
