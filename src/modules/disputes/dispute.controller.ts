import { Request, Response } from "express";
import { disputeService } from "./dispute.service";
import {
  createDisputeSchema,
  disputeIdSchema,
  listDisputeSchema,
  updateDisputeSchema,
} from "./dispute.validation";

export const disputeController = {
  create: async (req: Request, res: Response) => {
    const payload = createDisputeSchema.parse(req.body);
    const openedById = req.user?.id;

    if (!openedById) {
      return res.status(400).json({ message: "openedById is required" });
    }

    const dispute = await disputeService.create({
      ...payload,
      openedById,
    });
    return res.status(201).json(dispute);
  },

  list: async (req: Request, res: Response) => {
    const params = listDisputeSchema.parse(req.query);
    const result = await disputeService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = disputeIdSchema.parse(req.params);
    const dispute = await disputeService.getById(id);
    if (!dispute) {
      return res.status(404).json({ message: "Dispute not found" });
    }
    return res.status(200).json(dispute);
  },

  update: async (req: Request, res: Response) => {
    const { id } = disputeIdSchema.parse(req.params);
    const payload = updateDisputeSchema.parse(req.body);
    const dispute = await disputeService.update(id, payload);
    return res.status(200).json(dispute);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = disputeIdSchema.parse(req.params);
    await disputeService.remove(id);
    return res.status(204).send();
  },
};
