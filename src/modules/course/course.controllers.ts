import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getAllCourse = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          include: {
            videos: {
              include: {
                comments: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      courses,
      success: true,
      message: "Получены все курсы!",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Ошибка с сервера, попробуйте позже!",
    });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findMany();
    res.status(200).json({
      category,
      success: true,
      message: "Котегорие успешно получены!",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Ошибка с сервера, попробуйте позже!",
    });
  }
};
const getAllVideo = async (req: Request, res: Response) => {
  try {
    const video = await prisma.video.findMany();
    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {}
};
const getVideoById = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const video = await prisma.video.findUnique({
      where: { id },
      include: { comments: { include: { user: true } } },
    });
    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка при получении данных видео по айди" });
  }
};
const createNewComment = async (req: Request, res: Response) => {
  try {
    const { id, userId, text, videoId } = req.body;

    const comment = await prisma.comments.create({
      data: {
        id,
        userId,
        text,
        videoId,
        timestamp: Math.floor(Date.now() / 1000),
        createdAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при создании комментария" });
  }
};

export default {
  getAllCourse,
  getAllCategory,
  getAllVideo,
  getVideoById,
  createNewComment,
};
