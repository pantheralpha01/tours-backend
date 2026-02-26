"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInvitePublicRoutes = exports.partnerInviteRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
const partner_invite_controller_1 = require("./partner-invite.controller");
exports.partnerInviteRoutes = (0, express_1.Router)();
const partnerInvitePublicRoutes = (0, express_1.Router)();
exports.partnerInvitePublicRoutes = partnerInvitePublicRoutes;
exports.partnerInviteRoutes.use(auth_1.authenticate);
exports.partnerInviteRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER"));
exports.partnerInviteRoutes.post("/", partner_invite_controller_1.partnerInviteController.create);
exports.partnerInviteRoutes.get("/", partner_invite_controller_1.partnerInviteController.list);
partnerInvitePublicRoutes.post("/:token/accept", partner_invite_controller_1.partnerInviteController.accept);
//# sourceMappingURL=partner-invite.routes.js.map