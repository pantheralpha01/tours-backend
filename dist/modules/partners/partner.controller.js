"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerController = void 0;
const prisma_1 = require("../../config/prisma");
const partner_service_1 = require("./partner.service");
const ApiError_1 = require("../../utils/ApiError");
const partner_validation_1 = require("./partner.validation");
const partner_event_service_1 = require("./partner-event.service");
const pagination_1 = require("../../utils/pagination");
exports.partnerController = {
    /**
     * Partner self-signup (public endpoint)
     */
    signup: async (req, res) => {
        const payload = partner_validation_1.partnerSignupSchema.parse(req.body);
        // Check if email already exists as a user
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (existingUser) {
            throw ApiError_1.ApiError.conflict("Email already registered");
        }
        const result = await partner_service_1.partnerService.signup(payload);
        return res.status(201).json({
            message: "Partner signup successful. Your application is pending admin approval.",
            data: result,
        });
    },
    create: async (req, _res) => {
        // For now, the primary way to create partners is through signup
        // This endpoint would be for admin-created partners only
        if (!req.user?.id) {
            throw ApiError_1.ApiError.unauthorized();
        }
        throw ApiError_1.ApiError.badRequest("Use /api/partners/signup endpoint for partner registration");
    },
    list: async (req, res) => {
        const params = partner_validation_1.listPartnerSchema.parse(req.query);
        const result = await partner_service_1.partnerService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const partner = await partner_service_1.partnerService.getById(id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        return res.status(200).json(partner);
    },
    update: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const payload = partner_validation_1.updatePartnerSchema.parse(req.body);
        const partner = await partner_service_1.partnerService.update(id, payload);
        return res.status(200).json(partner);
    },
    remove: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        await partner_service_1.partnerService.remove(id);
        return res.status(204).send();
    },
    approve: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const actorId = req.user?.id;
        if (!actorId) {
            throw ApiError_1.ApiError.unauthorized();
        }
        const partner = await partner_service_1.partnerService.approve(id, actorId);
        return res.status(200).json(partner);
    },
    reject: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const payload = partner_validation_1.rejectPartnerSchema.parse(req.body);
        const actorId = req.user?.id;
        if (!actorId) {
            throw ApiError_1.ApiError.unauthorized();
        }
        const partner = await partner_service_1.partnerService.reject(id, actorId, payload.reason);
        return res.status(200).json(partner);
    },
    listEvents: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const params = pagination_1.paginationSchema.parse(req.query);
        const typeParam = req.query.type;
        const allowedTypes = new Set([
            "APPROVED",
            "REJECTED",
            "INVITED",
            "INVITE_ACCEPTED",
        ]);
        const type = typeof typeParam === "string" && allowedTypes.has(typeParam)
            ? typeParam
            : undefined;
        const partner = await partner_service_1.partnerService.getById(id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        const result = await partner_event_service_1.partnerEventService.list({
            partnerId: id,
            page: params.page,
            limit: params.limit,
            type,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            sort: params.sort,
        });
        return res.status(200).json(result);
    },
};
//# sourceMappingURL=partner.controller.js.map