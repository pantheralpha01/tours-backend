"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
const notification_controller_1 = require("./notification.controller");
exports.notificationRoutes = (0, express_1.Router)();
exports.notificationRoutes.use(auth_1.authenticate);
exports.notificationRoutes.post("/templates", (0, role_1.requireRoles)("ADMIN", "MANAGER"), notification_controller_1.notificationController.createTemplate);
exports.notificationRoutes.get("/templates", (0, role_1.requireRoles)("ADMIN", "MANAGER"), notification_controller_1.notificationController.listTemplates);
exports.notificationRoutes.post("/jobs", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), notification_controller_1.notificationController.schedule);
exports.notificationRoutes.get("/jobs", (0, role_1.requireRoles)("ADMIN", "MANAGER"), notification_controller_1.notificationController.listJobs);
exports.notificationRoutes.post("/jobs/:id/send-now", (0, role_1.requireRoles)("ADMIN", "MANAGER"), notification_controller_1.notificationController.sendNow);
exports.notificationRoutes.post("/sos", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), notification_controller_1.notificationController.triggerSos);
//# sourceMappingURL=notification.routes.js.map