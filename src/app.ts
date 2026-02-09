import express from "express";
import { config } from "dotenv";
import routes from "./routes";
import cors from "cors";
config();

const buildServer = () => {
  const server = express();
  server.use(
    cors({
      origin: ["http://localhost:3001", "http://localhost:3000"],
      credentials: true,
    })
  );
  server.use(express.json());
  server.get("/", (req, res) => {
    res.status(200).json({
      message: "server start",
    });
  });
  server.use("/api", routes);
  return server;
};

export default buildServer;
