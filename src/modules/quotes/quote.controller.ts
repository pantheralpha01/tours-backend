import { Request, Response } from "express";
import { quoteService } from "./quote.service";
import {
  createQuoteSchema,
  listQuoteSchema,
  quoteIdSchema,
  updateQuoteSchema,
} from "./quote.validation";

export const quoteController = {
  create: async (req: Request, res: Response) => {
    const payload = createQuoteSchema.parse(req.body);
    const agentId = payload.agentId ?? req.user?.id;

    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    const quote = await quoteService.create({
      ...payload,
      agentId,
    });
    return res.status(201).json(quote);
  },

  list: async (req: Request, res: Response) => {
    const params = listQuoteSchema.parse(req.query);
    const result = await quoteService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = quoteIdSchema.parse(req.params);
    const quote = await quoteService.getById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    return res.status(200).json(quote);
  },

  update: async (req: Request, res: Response) => {
    const { id } = quoteIdSchema.parse(req.params);
    const payload = updateQuoteSchema.parse(req.body);
    const quote = await quoteService.update(id, payload);
    return res.status(200).json(quote);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = quoteIdSchema.parse(req.params);
    await quoteService.remove(id);
    return res.status(204).send();
  },
};
