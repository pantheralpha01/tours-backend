import { z } from "zod";

export const notificationTypeEnum = z.enum(["REMINDER", "PROMO", "SOS", "COMMUNITY"]);
export const notificationChannelEnum = z.enum(["EMAIL", "SMS", "WHATSAPP"]);
export const notificationPriorityEnum = z.enum(["NORMAL", "HIGH", "CRITICAL"]);
export const notificationStatusEnum = z.enum([
  "DRAFT",
  "SCHEDULED",
  "QUEUED",
  "SENT",
  "FAILED",
  "CANCELLED",
]);

export const notificationTemplateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  type: notificationTypeEnum,
  channel: notificationChannelEnum,
  subject: z.string().optional().nullable(),
  body: z.string().min(5),
  tokens: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const scheduleNotificationSchema = z.object({
  templateSlug: z.string().min(3).optional(),
  type: notificationTypeEnum.optional(),
  channel: notificationChannelEnum.optional(),
  priority: notificationPriorityEnum.optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  tokens: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  scheduledAt: z.coerce.date().optional(),
  sendNow: z.boolean().optional(),
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z.string().min(5).optional(),
  bookingId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export const listNotificationsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  status: notificationStatusEnum.optional(),
  type: notificationTypeEnum.optional(),
  search: z.string().optional(),
});

export const sosSchema = z.object({
  message: z.string().min(5),
  recipientPhone: z.string().min(5).optional(),
  recipientEmail: z.string().email().optional(),
  bookingId: z.string().uuid().optional(),
}).refine((data) => data.recipientPhone || data.recipientEmail, {
  message: "Recipient phone or email is required",
  path: ["recipientPhone"],
});
