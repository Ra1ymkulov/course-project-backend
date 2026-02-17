import "dotenv/config";
import { buildServer, attachSocket } from "./app";
import http from "http";

// создаём Express приложение
const app = buildServer();

// создаём HTTP сервер для Socket.IO
const server = http.createServer(app);

// подключаем Socket.IO
attachSocket(server);

const start = () => {
  try {
    const PORT = Number(process.env.PORT) || 5000; // приводим к number
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`${new Date()}`);
      console.log(`Server running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Server crashed: ${error}`);
    process.exit(1);
  }
};

start();
