import { Request, Response } from "express";
import { offerService } from "./offer.service";
import {
  approveProposalSchema,
  idParamSchema,
  listProposalsSchema,
  listTemplatesSchema,
  publishProposalSchema,
  priceCalculationSchema,
  proposalSchema,
  templateSchema,
} from "./offer.validation";

export const offerController = {
  createTemplate: async (req: Request, res: Response) => {
    const payload = templateSchema.parse(req.body);
    const template = await offerService.createTemplate({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(template);
  },

  listTemplates: async (req: Request, res: Response) => {
    const params = listTemplatesSchema.parse(req.query);
    const result = await offerService.listTemplates(params);
    return res.status(200).json(result);
  },

  getTemplate: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const template = await offerService.getTemplateById(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json(template);
  },

  calculatePrice: async (req: Request, res: Response) => {
    const payload = priceCalculationSchema.parse(req.body);
    const result = offerService.calculatePrice(payload);
    return res.status(200).json(result);
  },

  createProposal: async (req: Request, res: Response) => {
    const payload = proposalSchema.parse(req.body);
    const proposal = await offerService.createProposal(payload);
    return res.status(201).json(proposal);
  },

  listProposals: async (req: Request, res: Response) => {
    const params = listProposalsSchema.parse(req.query);
    const result = await offerService.listProposals(params);
    return res.status(200).json(result);
  },

  getProposal: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const proposal = await offerService.getProposalById(id);
    return res.status(200).json(proposal);
  },

  generateAssets: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const proposal = await offerService.generateAssetsForProposal(id, {
      logo: req.query.logo !== "false",
      signature: req.query.signature !== "false",
    });
    return res.status(200).json(proposal);
  },

  generateContract: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const proposal = await offerService.generateContract(id);
    return res.status(200).json(proposal);
  },

  approveProposal: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const payload = approveProposalSchema.parse(req.body ?? {});
    const proposal = await offerService.approveProposal(id, {
      actorId: req.user?.id,
      notes: payload.notes,
    });
    return res.status(200).json(proposal);
  },

  publishProposal: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const payload = publishProposalSchema.parse(req.body ?? {});
    const proposal = await offerService.publishProposal(id, {
      actorId: req.user?.id,
      channel: payload.channel,
      notes: payload.notes,
    });
    return res.status(200).json(proposal);
  },
};
