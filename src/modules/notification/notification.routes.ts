import { Router } from "express";
import notificationControllers from "./notification.controllers";

const routes = Router();

routes.get(
  "/:id/get-notifications",
  notificationControllers.getNotifications,
);
routes.get(
  "/get-notification/:id",
  notificationControllers.getNotificationById,
);
routes.put("/notification/:id/read", notificationControllers.handleRead);

export default routes;
