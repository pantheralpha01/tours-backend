import { z } from "zod";

export const createInventorySchema = z.object({
  partnerId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().min(2).optional(),
  price: z.number().positive(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
});

export const updateInventorySchema = z.object({
  partnerId: z.string().uuid().optional(),
  title: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
});

export const inventoryIdSchema = z.object({
  id: z.string().uuid(),
});
