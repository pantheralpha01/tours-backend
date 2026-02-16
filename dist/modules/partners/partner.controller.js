"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerController = void 0;
const partner_service_1 = require("./partner.service");
const partner_validation_1 = require("./partner.validation");
const ApiError_1 = require("../../utils/ApiError");
const partner_event_service_1 = require("./partner-event.service");
const pagination_1 = require("../../utils/pagination");
exports.partnerController = {
    create: async (req, res) => {
        const payload = partner_validation_1.createPartnerSchema.parse(req.body);
        const partner = await partner_service_1.partnerService.create({
            ...payload,
            createdById: req.user?.id,
        });
        return res.status(201).json(partner);
    },
    list: async (req, res) => {
        const params = partner_validation_1.listPartnerSchema.parse(req.query);
        const createdById = req.user?.role === "AGENT" ? req.user.id : params.createdById;
        const result = await partner_service_1.partnerService.list({
            ...params,
            createdById,
        });
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = partner_validation_1.partnerIdSchema.parse(req.params);
        const partner = await partner_service_1.partnerService.getById(id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        if (req.user?.role === "AGENT" && partner.createdById !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
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
        const type = typeof typeParam === "string" &&
            (typeParam === "APPROVED" || typeParam === "REJECTED")
            ? typeParam
            : undefined;
        const partner = await partner_service_1.partnerService.getById(id);
        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        if (req.user?.role === "AGENT" && partner.createdById !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
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