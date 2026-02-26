"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notification_service_1 = require("./notification.service");
const notification_validation_1 = require("./notification.validation");
exports.notificationController = {
    createTemplate: async (req, res) => {
        const payload = notification_validation_1.notificationTemplateSchema.parse(req.body);
        const template = await notification_service_1.notificationService.createTemplate({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(template);
    },
    listTemplates: async (req, res) => {
        const params = notification_validation_1.listNotificationsSchema.parse(req.query);
        const result = await notification_service_1.notificationService.listTemplates(params);
        return res.status(200).json(result);
    },
    schedule: async (req, res) => {
        const payload = notification_validation_1.scheduleNotificationSchema.parse(req.body);
        const job = await notification_service_1.notificationService.scheduleNotification({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(job);
    },
    listJobs: async (req, res) => {
        const params = notification_validation_1.listNotificationsSchema.parse(req.query);
        const result = await notification_service_1.notificationService.listJobs(params);
        return res.status(200).json(result);
    },
    sendNow: async (req, res) => {
        const jobId = req.params.id;
        const result = await notification_service_1.notificationService.processJob(jobId);
        return res.status(202).json({ status: result.status });
    },
    triggerSos: async (req, res) => {
        const payload = notification_validation_1.sosSchema.parse(req.body);
        const job = await notification_service_1.notificationService.triggerSos({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(job);
    },
};
//# sourceMappingURL=notification.controller.js.map