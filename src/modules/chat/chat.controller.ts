import { Request, Response } from "express";
import * as chatService from "./chat.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createNewChat = async (req: AuthRequest, res: Response) => {
  const { title, users, avatar } = req.body;
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);
  try {
    const chat = await chatService.createChat(
      title,
      [req.userId!, ...users],
      avatar
    );
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat", error: err });
  }
};

export const getMyChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await chatService.getMyChats(req.userId!);
    console.log(chats);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats", error: err });
  }
};

export const getAllChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await chatService.getAllChats();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats", error: err });
  }
};

export const postMessage = async (req: AuthRequest, res: Response) => {
  // 🔹 Защита: req.body может быть undefined
  const { chatId, text } = req.body || {};

  // 🔹 Проверяем, что оба поля есть
  if (!chatId || !text) {
    return res.status(400).json({ message: "chatId and text are required" });
  }

  try {
    // 🔹 Отправка сообщения через сервис
    const message = await chatService.sendMessage(chatId, req.userId!, text);

    // 🔹 Возвращаем сообщение клиенту
    res.json(message);
  } catch (err) {
    console.error(err); // 🔹 логируем ошибку на сервер
    res.status(500).json({ message: "Error sending message", error: err });
  }
};

export const removeChat = async (req: AuthRequest, res: Response) => {
  const chatIdParam = req.params.chatId;
  const chatId = Array.isArray(chatIdParam) ? chatIdParam[0] : chatIdParam;
  if (!chatId) {
    return res.status(400).json({ message: "chatId is required" });
  }
  try {
    const chat = await chatService.deleteChat(chatId);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error deleting chat", error: err });
  }
};
