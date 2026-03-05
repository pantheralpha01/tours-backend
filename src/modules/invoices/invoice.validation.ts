import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const invoiceStatusEnum = z.enum([
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
]);

export const transactionTypeEnum = z.enum(["DEPOSIT", "BALANCE"]);

export const createInvoiceSchema = z.object({
  bookingId: z.string().uuid(),
  customerName: z.string().min(2).max(255),
  customerEmail: z.string().email(),
  totalAmount: z.number().positive(),
  depositAmount: z.number().positive(),
  balanceAmount: z.number().nonnegative(),
  dueDate: z.coerce.date(),
  notes: z.string().max(1000).optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: invoiceStatusEnum,
  transitionReason: z.string().max(500).optional(),
});

export const invoiceIdSchema = z.object({
  id: z.string().uuid(),
});

export const sendInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
  paymentLink: z.string().url().optional(),
  customMessage: z.string().max(1000).optional(),
});

export const listInvoicesSchema = z.object({
  ...paginationSchema.shape,
  bookingId: z.string().uuid().optional(),
  status: invoiceStatusEnum.optional(),
  customerEmail: z.string().email().optional(),
});

export const invoiceQuerySchema = z.object({
  bookingId: z.string().uuid().optional(),
  status: invoiceStatusEnum.optional(),
  customerEmail: z.string().email().optional(),
  skip: z.coerce.number().min(0).default(0),
  take: z.coerce.number().min(1).max(100).default(10),
});

export const createTransactionSchema = z.object({
  invoiceId: z.string().uuid(),
  transactionId: z.string().min(3),
  type: transactionTypeEnum,
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).default("KES"),
  status: z
    .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
    .default("PENDING"),
  paymentMethod: z.string().optional(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateTransactionSchema = z.object({
  status: z
    .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export const transactionIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatus = z.infer<typeof updateInvoiceStatusSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type ListInvoicesQuery = z.infer<typeof invoiceQuerySchema>;
