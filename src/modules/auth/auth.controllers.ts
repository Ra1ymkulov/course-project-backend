import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../config/token";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    if (checkEmail) {
      return res.status(401).json({
        success: false,
        message: "Пользователь уже существует!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "LOCAL",
      },
    });

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      message: "Вы успешно зарегистрировались!",
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
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

    if (user.provider === "GOOGLE") {
      return res.status(400).json({
        success: false,
        message: "Используйте вход через Google",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль!",
      });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google token обязателен",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Не удалось получить данные Google",
      });
    }

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "google_user",
          avatar: picture,
          password: null,
          provider: "GOOGLE",
        },
      });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка Google авторизации",
    });
  }
};

export default {
  register,
  login,
  googleAuth,
};
