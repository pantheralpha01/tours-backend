"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const payment_validation_1 = require("./payment.validation");
const pagination_1 = require("../../utils/pagination");
exports.paymentController = {
    create: async (req, res) => {
        const payload = payment_validation_1.createPaymentSchema.parse(req.body);
        const payment = await payment_service_1.paymentService.create(payload);
        return res.status(201).json(payment);
    },
    list: async (req, res) => {
        const params = pagination_1.paginationSchema.parse(req.query);
        const result = await payment_service_1.paymentService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        const payment = await payment_service_1.paymentService.getById(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        return res.status(200).json(payment);
    },
    update: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        const payload = payment_validation_1.updatePaymentSchema.parse(req.body);
        const payment = await payment_service_1.paymentService.update(id, payload);
        return res.status(200).json(payment);
    },
    remove: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        await payment_service_1.paymentService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=payment.controller.js.map