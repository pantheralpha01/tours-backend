"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInviteController = void 0;
const partner_invite_service_1 = require("./partner-invite.service");
exports.partnerInviteController = {
    create: async (_req, res) => {
        const invite = await partner_invite_service_1.partnerInviteService.create();
        return res.status(201).json(invite);
    },
    list: async (_req, res) => {
        const result = await partner_invite_service_1.partnerInviteService.list();
        return res.status(200).json(result);
    },
    accept: async (_req, res) => {
        const invite = await partner_invite_service_1.partnerInviteService.accept();
        return res.status(200).json({
            message: "Invite accepted",
            invite,
        });
    },
};
//# sourceMappingURL=partner-invite.controller.js.map