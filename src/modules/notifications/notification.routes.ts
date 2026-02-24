import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { notificationController } from "./notification.controller";

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);

notificationRoutes.post(
  "/templates",
  requireRoles("ADMIN", "MANAGER"),
  notificationController.createTemplate
);
notificationRoutes.get(
  "/templates",
  requireRoles("ADMIN", "MANAGER"),
  notificationController.listTemplates
);

notificationRoutes.post(
  "/jobs",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  notificationController.schedule
);
notificationRoutes.get(
  "/jobs",
  requireRoles("ADMIN", "MANAGER"),
  notificationController.listJobs
);
notificationRoutes.post(
  "/jobs/:id/send-now",
  requireRoles("ADMIN", "MANAGER"),
  notificationController.sendNow
);

notificationRoutes.post(
  "/sos",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  notificationController.triggerSos
);
