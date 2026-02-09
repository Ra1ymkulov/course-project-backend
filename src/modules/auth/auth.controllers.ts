import { Request, Response } from "express";
import { prisma } from "../../lid/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../config/token";
import { OAuth2Client } from "google-auth-library";

const getUserAll = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        notification: true,
      },
    });
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

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, пароль и имя обязательны",
      });
    }
    const emailRight = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRight.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Некорректный формат email",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Пароль должен быть не менее 6 символов",
      });
    }
    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Имя должно быть не менее 2 символов",
      });
    }
    const checkEmail = await prisma.user.findUnique({ where: { email } });
    const checkName = await prisma.user.findUnique({ where: { name } });
    if (checkEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Пользователь уже существует!" });
    }
    if (checkName) {
      return res.status(400).json({
        success: false,
        message: "Имя уже занято",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = generateToken(user.id, user.email);
    res.status(200).json({
      success: true,
      message: "Вы успешно зарегистрировались!",
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Пользователь не найден!",
      });
    }
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Вход через Google. Используйте Google Sign-In",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Не верный пароль!",
      });
    }
    const token = generateToken(user.id, user.email);
    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const googleAuth = async (req: Request, res: Response) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token отсутствует",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Неверный Google token",
      });
    }

    const { email, name, sub: googleId } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email!,
          name: name || "Google User",
          googleId,
        },
      });
    }

    const jwtToken = generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      token: jwtToken,
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  register,
  login,
  getUserAll,
  googleAuth,
};
