"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeController = void 0;
const dispute_service_1 = require("./dispute.service");
const dispute_validation_1 = require("./dispute.validation");
exports.disputeController = {
    create: async (req, res) => {
        const payload = dispute_validation_1.createDisputeSchema.parse(req.body);
        const openedById = req.user?.id;
        if (!openedById) {
            return res.status(400).json({ message: "openedById is required" });
        }
        const dispute = await dispute_service_1.disputeService.create({
            ...payload,
            openedById,
        });
        return res.status(201).json(dispute);
    },
    list: async (req, res) => {
        const params = dispute_validation_1.listDisputeSchema.parse(req.query);
        const result = await dispute_service_1.disputeService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = dispute_validation_1.disputeIdSchema.parse(req.params);
        const dispute = await dispute_service_1.disputeService.getById(id);
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }
        return res.status(200).json(dispute);
    },
    update: async (req, res) => {
        const { id } = dispute_validation_1.disputeIdSchema.parse(req.params);
        const payload = dispute_validation_1.updateDisputeSchema.parse(req.body);
        const dispute = await dispute_service_1.disputeService.update(id, payload);
        return res.status(200).json(dispute);
    },
    remove: async (req, res) => {
        const { id } = dispute_validation_1.disputeIdSchema.parse(req.params);
        await dispute_service_1.disputeService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=dispute.controller.js.map