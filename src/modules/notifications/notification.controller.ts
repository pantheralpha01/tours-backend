import { Request, Response } from "express";
import { notificationService } from "./notification.service";
import {
  listNotificationsSchema,
  notificationTemplateSchema,
  scheduleNotificationSchema,
  sosSchema,
} from "./notification.validation";

export const notificationController = {
  createTemplate: async (req: Request, res: Response) => {
    const payload = notificationTemplateSchema.parse(req.body);
    const template = await notificationService.createTemplate({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(template);
  },

  listTemplates: async (req: Request, res: Response) => {
    const params = listNotificationsSchema.parse(req.query);
    const result = await notificationService.listTemplates(params);
    return res.status(200).json(result);
  },

  schedule: async (req: Request, res: Response) => {
    const payload = scheduleNotificationSchema.parse(req.body);
    const job = await notificationService.scheduleNotification({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(job);
  },

  listJobs: async (req: Request, res: Response) => {
    const params = listNotificationsSchema.parse(req.query);
    const result = await notificationService.listJobs(params);
    return res.status(200).json(result);
  },

  sendNow: async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const result = await notificationService.processJob(jobId);
    return res.status(202).json({ status: result.status });
  },

  triggerSos: async (req: Request, res: Response) => {
    const payload = sosSchema.parse(req.body);
    const job = await notificationService.triggerSos({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(job);
  },
};
