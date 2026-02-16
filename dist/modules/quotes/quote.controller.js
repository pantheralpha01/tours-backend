"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteController = void 0;
const quote_service_1 = require("./quote.service");
const quote_validation_1 = require("./quote.validation");
exports.quoteController = {
    create: async (req, res) => {
        const payload = quote_validation_1.createQuoteSchema.parse(req.body);
        const agentId = payload.agentId ?? req.user?.id;
        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }
        const quote = await quote_service_1.quoteService.create({
            ...payload,
            agentId,
        });
        return res.status(201).json(quote);
    },
    list: async (req, res) => {
        const params = quote_validation_1.listQuoteSchema.parse(req.query);
        const result = await quote_service_1.quoteService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = quote_validation_1.quoteIdSchema.parse(req.params);
        const quote = await quote_service_1.quoteService.getById(id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        return res.status(200).json(quote);
    },
    update: async (req, res) => {
        const { id } = quote_validation_1.quoteIdSchema.parse(req.params);
        const payload = quote_validation_1.updateQuoteSchema.parse(req.body);
        const quote = await quote_service_1.quoteService.update(id, payload);
        return res.status(200).json(quote);
    },
    remove: async (req, res) => {
        const { id } = quote_validation_1.quoteIdSchema.parse(req.params);
        await quote_service_1.quoteService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=quote.controller.js.map