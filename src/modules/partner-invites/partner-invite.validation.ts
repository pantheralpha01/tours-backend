import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const inviteStatusEnum = z.enum(["PENDING", "ACCEPTED", "EXPIRED"]);

export const createPartnerInviteSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email(),
  expiresInDays: z.number().int().min(1).max(60).optional(),
  notes: z.string().max(1000).optional(),
});

export const listPartnerInviteSchema = paginationSchema.extend({
  status: inviteStatusEnum.optional(),
  invitedById: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const acceptPartnerInviteSchema = z.object({
  companyName: z.string().min(2).optional(),
  contactName: z.string().min(2),
  phone: z.string().min(7).optional(),
  notes: z.string().max(1000).optional(),
});
