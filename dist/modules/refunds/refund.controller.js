"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundController = void 0;
const refund_service_1 = require("./refund.service");
const refund_validation_1 = require("./refund.validation");
exports.refundController = {
    create: async (req, res) => {
        const payload = refund_validation_1.createRefundSchema.parse(req.body);
        const refund = await refund_service_1.refundService.create(payload);
        return res.status(201).json(refund);
    },
    list: async (req, res) => {
        const params = refund_validation_1.listRefundSchema.parse(req.query);
        const result = await refund_service_1.refundService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = refund_validation_1.refundIdSchema.parse(req.params);
        const refund = await refund_service_1.refundService.getById(id);
        if (!refund) {
            return res.status(404).json({ message: "Refund not found" });
        }
        return res.status(200).json(refund);
    },
    update: async (req, res) => {
        const { id } = refund_validation_1.refundIdSchema.parse(req.params);
        const payload = refund_validation_1.updateRefundSchema.parse(req.body);
        const refund = await refund_service_1.refundService.update(id, payload);
        return res.status(200).json(refund);
    },
    remove: async (req, res) => {
        const { id } = refund_validation_1.refundIdSchema.parse(req.params);
        await refund_service_1.refundService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=refund.controller.js.map