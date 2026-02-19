import { Router } from "express";
import * as chatController from "./chat.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, chatController.createNewChat);
router.post("/message", authMiddleware, chatController.postMessage);
router.get("/", authMiddleware, chatController.getMyChats);
router.get("/all", authMiddleware, chatController.getAllChats);
router.delete("/:chatId", authMiddleware, chatController.removeChat);

export default router;
