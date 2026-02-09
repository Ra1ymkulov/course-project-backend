import { Router } from "express";
import userControllers from "./user.controllers";

const routes = Router();

routes.get("/user/:id", userControllers.getUser);

export default routes;
