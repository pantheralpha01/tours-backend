import { Request, Response } from "express";
import { refundService } from "./refund.service";
import {
  createRefundSchema,
  listRefundSchema,
  refundIdSchema,
  updateRefundSchema,
} from "./refund.validation";

export const refundController = {
  create: async (req: Request, res: Response) => {
    const payload = createRefundSchema.parse(req.body);
    const refund = await refundService.create(payload);
    return res.status(201).json(refund);
  },

  list: async (req: Request, res: Response) => {
    const params = listRefundSchema.parse(req.query);
    const result = await refundService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = refundIdSchema.parse(req.params);
    const refund = await refundService.getById(id);
    if (!refund) {
      return res.status(404).json({ message: "Refund not found" });
    }
    return res.status(200).json(refund);
  },

  update: async (req: Request, res: Response) => {
    const { id } = refundIdSchema.parse(req.params);
    const payload = updateRefundSchema.parse(req.body);
    const refund = await refundService.update(id, payload);
    return res.status(200).json(refund);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = refundIdSchema.parse(req.params);
    await refundService.remove(id);
    return res.status(204).send();
  },
};
