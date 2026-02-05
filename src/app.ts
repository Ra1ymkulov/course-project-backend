import express from "express";
import { config } from "dotenv";
import routes from "./routes";
config();

const buildServer = () => {
  const server = express();
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
