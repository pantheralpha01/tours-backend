"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInviteController = void 0;
const partner_invite_service_1 = require("./partner-invite.service");
const partner_invite_validation_1 = require("./partner-invite.validation");
const ApiError_1 = require("../../utils/ApiError");
exports.partnerInviteController = {
    create: async (req, res) => {
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized();
        }
        const payload = partner_invite_validation_1.createPartnerInviteSchema.parse(req.body);
        const invite = await partner_invite_service_1.partnerInviteService.create({
            ...payload,
            invitedById: req.user.id,
        });
        return res.status(201).json(invite);
    },
    list: async (req, res) => {
        const params = partner_invite_validation_1.listPartnerInviteSchema.parse(req.query);
        const invitedById = req.user?.role === "AGENT" ? req.user.id : params.invitedById;
        const result = await partner_invite_service_1.partnerInviteService.list({
            ...params,
            invitedById,
        });
        return res.status(200).json(result);
    },
    accept: async (req, res) => {
        const { token } = req.params;
        if (!token) {
            throw ApiError_1.ApiError.badRequest("Invite token is required");
        }
        const payload = partner_invite_validation_1.acceptPartnerInviteSchema.parse(req.body);
        const invite = await partner_invite_service_1.partnerInviteService.accept(token, payload);
        return res.status(200).json({
            message: "Invite accepted",
            invite,
        });
    },
};
//# sourceMappingURL=partner-invite.controller.js.map