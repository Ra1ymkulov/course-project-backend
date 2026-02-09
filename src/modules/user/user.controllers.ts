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
export default {
  getUser,
};
