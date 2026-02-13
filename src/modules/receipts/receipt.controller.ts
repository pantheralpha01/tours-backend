import { Request, Response } from "express";
import { receiptService } from "./receipt.service";
import {
  createReceiptSchema,
  listReceiptSchema,
  receiptIdSchema,
  updateReceiptSchema,
} from "./receipt.validation";

export const receiptController = {
  create: async (req: Request, res: Response) => {
    const payload = createReceiptSchema.parse(req.body);
    const receipt = await receiptService.create(payload);
    return res.status(201).json(receipt);
  },

  list: async (req: Request, res: Response) => {
    const params = listReceiptSchema.parse(req.query);
    const result = await receiptService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = receiptIdSchema.parse(req.params);
    const receipt = await receiptService.getById(id);
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    return res.status(200).json(receipt);
  },

  update: async (req: Request, res: Response) => {
    const { id } = receiptIdSchema.parse(req.params);
    const payload = updateReceiptSchema.parse(req.body);
    const receipt = await receiptService.update(id, payload);
    return res.status(200).json(receipt);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = receiptIdSchema.parse(req.params);
    await receiptService.remove(id);
    return res.status(204).send();
  },
};
