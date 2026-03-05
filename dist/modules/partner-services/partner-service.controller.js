"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerServiceController = void 0;
const partner_service_service_1 = require("./partner-service.service");
const partner_service_validation_1 = require("./partner-service.validation");
exports.partnerServiceController = {
    // POST /api/partner-services  (role: PARTNER)
    create: async (req, res, next) => {
        try {
            const body = partner_service_validation_1.createPartnerServiceSchema.parse(req.body);
            const service = await partner_service_service_1.partnerServiceService.createService(req.user.id, body);
            return res.status(201).json({ message: "Service listing created", data: service });
        }
        catch (err) {
            return next(err);
        }
    },
    // GET /api/partner-services  (role: AGENT, ADMIN, MANAGER, PARTNER)
    list: async (req, res, next) => {
        try {
            const query = partner_service_validation_1.listPartnerServicesSchema.parse(req.query);
            const result = await partner_service_service_1.partnerServiceService.listServices(query);
            return res.json({ data: result.items, meta: { total: result.total, skip: result.skip, take: result.take } });
        }
        catch (err) {
            return next(err);
        }
    },
    // GET /api/partner-services/:id
    getOne: async (req, res, next) => {
        try {
            const service = await partner_service_service_1.partnerServiceService.getService(req.params.id);
            return res.json({ data: service });
        }
        catch (err) {
            return next(err);
        }
    },
    // PATCH /api/partner-services/:id  (role: PARTNER — own only)
    update: async (req, res, next) => {
        try {
            const body = partner_service_validation_1.updatePartnerServiceSchema.parse(req.body);
            const service = await partner_service_service_1.partnerServiceService.updateService(req.user.id, req.params.id, body);
            return res.json({ message: "Service listing updated", data: service });
        }
        catch (err) {
            return next(err);
        }
    },
    // DELETE /api/partner-services/:id  (role: PARTNER — own only)
    remove: async (req, res, next) => {
        try {
            await partner_service_service_1.partnerServiceService.deleteService(req.user.id, req.params.id);
            return res.json({ message: "Service listing deleted" });
        }
        catch (err) {
            return next(err);
        }
    },
    // PATCH /api/partner-services/:id/admin  (role: ADMIN)
    adminUpdate: async (req, res, next) => {
        try {
            const body = partner_service_validation_1.updatePartnerServiceSchema.parse(req.body);
            const service = await partner_service_service_1.partnerServiceService.adminUpdateService(req.params.id, body);
            return res.json({ message: "Service listing updated by admin", data: service });
        }
        catch (err) {
            return next(err);
        }
    },
};
//# sourceMappingURL=partner-service.controller.js.map