import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import {
  createPaymentSchema,
  paymentIdSchema,
  updatePaymentSchema,
} from "./payment.validation";
import { paginationSchema } from "../../utils/pagination";

export const paymentController = {
  create: async (req: Request, res: Response) => {
    const payload = createPaymentSchema.parse(req.body);
    const payment = await paymentService.create(payload);
    return res.status(201).json(payment);
  },

  list: async (req: Request, res: Response) => {
    const params = paginationSchema.parse(req.query);
    const result = await paymentService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    const payment = await paymentService.getById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(payment);
  },

  update: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    const payload = updatePaymentSchema.parse(req.body);
    const payment = await paymentService.update(id, payload);
    return res.status(200).json(payment);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    await paymentService.remove(id);
    return res.status(204).send();
  },
};
