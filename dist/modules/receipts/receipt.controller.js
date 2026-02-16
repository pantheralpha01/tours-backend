"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptController = void 0;
const receipt_service_1 = require("./receipt.service");
const receipt_validation_1 = require("./receipt.validation");
exports.receiptController = {
    create: async (req, res) => {
        const payload = receipt_validation_1.createReceiptSchema.parse(req.body);
        const receipt = await receipt_service_1.receiptService.create(payload);
        return res.status(201).json(receipt);
    },
    list: async (req, res) => {
        const params = receipt_validation_1.listReceiptSchema.parse(req.query);
        const result = await receipt_service_1.receiptService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = receipt_validation_1.receiptIdSchema.parse(req.params);
        const receipt = await receipt_service_1.receiptService.getById(id);
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        return res.status(200).json(receipt);
    },
    update: async (req, res) => {
        const { id } = receipt_validation_1.receiptIdSchema.parse(req.params);
        const payload = receipt_validation_1.updateReceiptSchema.parse(req.body);
        const receipt = await receipt_service_1.receiptService.update(id, payload);
        return res.status(200).json(receipt);
    },
    remove: async (req, res) => {
        const { id } = receipt_validation_1.receiptIdSchema.parse(req.params);
        await receipt_service_1.receiptService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=receipt.controller.js.map