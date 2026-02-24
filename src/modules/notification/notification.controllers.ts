import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    if (!userId) {
      res
        .status(400)
        .json({ message: `Ошибка при получении айди пользователя` });
    }
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении уведомлений" });
  }
};
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID" });
    }
    const notification = await prisma.notification.findUnique({
      where: { id: id },
    });
    if (!notification) {
      return res.status(404).json({ message: "Уведомление не найдено" });
    }
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении уведомления" });
  }
};
const handleRead = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID уведомления" });
    }
    const notification = await prisma.notification.update({
      where: { id: id },
      data: { read: true },
    });
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при обновлении уведомления" });
  }
};
export default {
  getNotifications,
  getNotificationById,
  handleRead,
};
