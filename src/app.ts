import express from "express";
import cors from "cors";
import { config } from "dotenv";
import routes from "./routes";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { setupSocket } from "./socket";

config();

export const buildServer = () => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "server start" });
  });

  app.use("/api", routes);

  return app;
};

export const attachSocket = (server: http.Server) => {
  const io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
    },
  });

  setupSocket(io);
  return io;
};
