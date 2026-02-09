import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import userRouter from "../modules/user/user.routes";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", userRouter);

export default routes;
