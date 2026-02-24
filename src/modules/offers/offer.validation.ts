import { z } from "zod";

export const currencyEnum = z.enum(["USD", "KES"]);

export const addonSchema = z.object({
  label: z.string().min(2),
  amount: z.number().min(0),
});

export const itineraryItemSchema = z.object({
  day: z.number().min(1),
  title: z.string().min(2),
  summary: z.string().optional(),
  activities: z.array(z.string().min(2)).optional(),
  notes: z.string().optional(),
});

export const templateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  defaultCurrency: currencyEnum.optional(),
  baseAmount: z.number().positive().optional(),
  feePercentage: z.number().min(0).max(1).optional(),
  itinerary: z.array(itineraryItemSchema).optional(),
  addons: z.array(addonSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

export const priceCalculationSchema = z.object({
  baseAmount: z.number().positive(),
  addons: z.array(addonSchema).optional(),
  currency: currencyEnum.optional(),
  discountRateOverride: z.number().min(0).max(0.5).optional(),
});

export const proposalSchema = priceCalculationSchema.extend({
  bookingId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  itinerary: z.array(itineraryItemSchema).optional(),
  notes: z.string().max(2000).optional(),
  expiresAt: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listTemplatesSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
});

export const listProposalsSchema = listTemplatesSchema.extend({
  status: z.enum(["DRAFT", "APPROVED", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
  bookingId: z.string().uuid().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const approveProposalSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const publishProposalSchema = z.object({
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "LINK"]).optional(),
  notes: z.string().max(2000).optional(),
});
