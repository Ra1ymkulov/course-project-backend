import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getUser = async (req: Request, res: Response) => {
  try {
    let id = req.params.id;
    if (Array.isArray(id)) {
      id = id[0];
    }
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        notification: true,
        course: {
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
        },
      },
    });
    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (error) { 
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, avatar, banner, email, country } = req.body;
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        avatar,
        banner,
        country,
      },
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export default {
  getUser,
  getAllUser,
  updateProfile,
};
