import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import userRouter from "../modules/user/user.routes";
import courseRouter from "../modules/course/course.routes";
import chatRoutes from "../modules/chat/chat.routes";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", userRouter);
routes.use("/course", courseRouter);
routes.use("/chat", chatRoutes);

export default routes;
