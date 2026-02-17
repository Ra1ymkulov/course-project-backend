import { Server } from "socket.io";
import * as chatService from "./modules/chat/chat.service";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";

// 🔹 Тип для payload JWT
interface JwtPayload {
  id: string;
  email: string;
}

export const setupSocket = (io: Server) => {
  // 🔹 Middleware для Socket.IO: проверка JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // клиент должен передать token
    if (!token) return next(new Error("No token provided"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      (socket as any).userId = payload.id; // сохраняем userId в сокете
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    console.log("New client connected:", socket.id, "userId:", userId);

    // 🔹 Присоединение к комнате чата
    socket.on("joinRoom", (chatId: string) => {
      socket.join(chatId);
      console.log(`${socket.id} joined room ${chatId}`);
    });

    // 🔹 Отправка сообщения

    socket.on("sendMessage", async ({ chatId, text }) => {
      if (!userId) return;

      // 1️⃣ получаем данные пользователя заранее
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, avatar: true },
      });

      if (!user) return;

      // 2️⃣ временное сообщение сразу для фронта
      const tempMessage = {
        id: crypto.randomUUID(),
        chatId,
        text,
        userId,
        createdAt: new Date(),
        user, // теперь имя и аватар есть
      };

      // 3️⃣ отправляем мгновенно
      io.to(chatId).emit("newMessage", tempMessage);

      // 4️⃣ сохраняем в базе
      const message = await chatService.sendMessage(chatId, userId, text);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
