import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";

const routes = Router();

routes.use("/user", authRouter);

export default routes;
