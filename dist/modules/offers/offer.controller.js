"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerController = void 0;
const offer_service_1 = require("./offer.service");
const offer_validation_1 = require("./offer.validation");
exports.offerController = {
    createTemplate: async (req, res) => {
        const payload = offer_validation_1.templateSchema.parse(req.body);
        const template = await offer_service_1.offerService.createTemplate({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(template);
    },
    listTemplates: async (req, res) => {
        const params = offer_validation_1.listTemplatesSchema.parse(req.query);
        const result = await offer_service_1.offerService.listTemplates(params);
        return res.status(200).json(result);
    },
    getTemplate: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const template = await offer_service_1.offerService.getTemplateById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        return res.status(200).json(template);
    },
    calculatePrice: async (req, res) => {
        const payload = offer_validation_1.priceCalculationSchema.parse(req.body);
        const result = offer_service_1.offerService.calculatePrice(payload);
        return res.status(200).json(result);
    },
    createProposal: async (req, res) => {
        const payload = offer_validation_1.proposalSchema.parse(req.body);
        const proposal = await offer_service_1.offerService.createProposal(payload);
        return res.status(201).json(proposal);
    },
    listProposals: async (req, res) => {
        const params = offer_validation_1.listProposalsSchema.parse(req.query);
        const result = await offer_service_1.offerService.listProposals(params);
        return res.status(200).json(result);
    },
    getProposal: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const proposal = await offer_service_1.offerService.getProposalById(id);
        return res.status(200).json(proposal);
    },
    generateAssets: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const proposal = await offer_service_1.offerService.generateAssetsForProposal(id, {
            logo: req.query.logo !== "false",
            signature: req.query.signature !== "false",
        });
        return res.status(200).json(proposal);
    },
    generateContract: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const proposal = await offer_service_1.offerService.generateContract(id);
        return res.status(200).json(proposal);
    },
    approveProposal: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const payload = offer_validation_1.approveProposalSchema.parse(req.body ?? {});
        const proposal = await offer_service_1.offerService.approveProposal(id, {
            actorId: req.user?.id,
            notes: payload.notes,
        });
        return res.status(200).json(proposal);
    },
    publishProposal: async (req, res) => {
        const { id } = offer_validation_1.idParamSchema.parse(req.params);
        const payload = offer_validation_1.publishProposalSchema.parse(req.body ?? {});
        const proposal = await offer_service_1.offerService.publishProposal(id, {
            actorId: req.user?.id,
            channel: payload.channel,
            notes: payload.notes,
        });
        return res.status(200).json(proposal);
    },
};
//# sourceMappingURL=offer.controller.js.map