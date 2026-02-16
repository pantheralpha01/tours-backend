"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
const inventory_validation_1 = require("./inventory.validation");
const partner_service_1 = require("../partners/partner.service");
const ApiError_1 = require("../../utils/ApiError");
exports.inventoryController = {
    create: async (req, res) => {
        const payload = inventory_validation_1.createInventorySchema.parse(req.body);
        if (req.user?.role === "AGENT") {
            const partner = await partner_service_1.partnerService.getById(payload.partnerId);
            if (!partner) {
                return res.status(404).json({ message: "Partner not found" });
            }
            if (partner.createdById !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
            if (partner.approvalStatus !== "APPROVED") {
                throw ApiError_1.ApiError.forbidden("Partner must be approved before adding inventory");
            }
        }
        const item = await inventory_service_1.inventoryService.create(payload);
        return res.status(201).json(item);
    },
    list: async (req, res) => {
        const createdById = req.user?.role === "AGENT" ? req.user.id : undefined;
        const items = await inventory_service_1.inventoryService.list({ createdById });
        return res.status(200).json(items);
    },
    getById: async (req, res) => {
        const { id } = inventory_validation_1.inventoryIdSchema.parse(req.params);
        const item = await inventory_service_1.inventoryService.getById(id);
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        if (req.user?.role === "AGENT" && item.partner.createdById !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
        }
        return res.status(200).json(item);
    },
    update: async (req, res) => {
        const { id } = inventory_validation_1.inventoryIdSchema.parse(req.params);
        if (req.user?.role === "AGENT") {
            const current = await inventory_service_1.inventoryService.getById(id);
            if (!current) {
                return res.status(404).json({ message: "Inventory item not found" });
            }
            if (current.partner.createdById !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
        }
        const payload = inventory_validation_1.updateInventorySchema.parse(req.body);
        const item = await inventory_service_1.inventoryService.update(id, payload);
        return res.status(200).json(item);
    },
    remove: async (req, res) => {
        const { id } = inventory_validation_1.inventoryIdSchema.parse(req.params);
        if (req.user?.role === "AGENT") {
            const current = await inventory_service_1.inventoryService.getById(id);
            if (!current) {
                return res.status(404).json({ message: "Inventory item not found" });
            }
            if (current.partner.createdById !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
        }
        await inventory_service_1.inventoryService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=inventory.controller.js.map