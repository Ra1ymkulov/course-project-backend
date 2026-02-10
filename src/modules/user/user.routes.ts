import { Router } from "express";
import userControllers from "./user.controllers";

const routes = Router();

routes.get("/user/:id", userControllers.getUser);
routes.get("/users", userControllers.getAllUser);

export default routes;
