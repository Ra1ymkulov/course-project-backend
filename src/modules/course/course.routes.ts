import { Router } from "express";
import courseControllers from "./course.controllers";

const routes = Router();

routes.get("/get-all-courses", courseControllers.getAllCourse);
routes.get("/get-all-category", courseControllers.getAllCategory);
routes.get("/get-all-video", courseControllers.getAllVideo);
routes.get("/get-video-by/:id", courseControllers.getVideoById);
routes.post("/send-comment", courseControllers.createNewComment);

export default routes;
