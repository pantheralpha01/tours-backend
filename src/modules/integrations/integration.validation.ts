import { z } from "zod";

export const sendWhatsappSchema = z.object({
  to: z.string().min(6),
  message: z.string().min(1),
});

export const respondWebhookSchema = z.record(z.any());

export const airtableSyncSchema = z.object({
  action: z.enum(["pull", "push"]),
  table: z.string().min(1).optional(),
});

export const paymentIntentSchema = z.object({
  provider: z.enum(["MPESA", "PAYPAL", "VISA", "MASTERCARD", "STRIPE"]),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  reference: z.string().min(3).optional(),
});
