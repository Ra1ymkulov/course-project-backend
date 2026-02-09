import { Router } from "express";
import userControllers from "./auth.controllers";

const routes = Router();

routes.get("/get-users", userControllers.getUserAll);
routes.post("/register", userControllers.register);
routes.post("/login", userControllers.login);
routes.post("/google", userControllers.googleAuth);

export default routes;
