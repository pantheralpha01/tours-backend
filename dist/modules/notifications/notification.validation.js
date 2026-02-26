"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sosSchema = exports.listNotificationsSchema = exports.scheduleNotificationSchema = exports.notificationTemplateSchema = exports.notificationStatusEnum = exports.notificationPriorityEnum = exports.notificationChannelEnum = exports.notificationTypeEnum = void 0;
const zod_1 = require("zod");
exports.notificationTypeEnum = zod_1.z.enum(["REMINDER", "PROMO", "SOS", "COMMUNITY"]);
exports.notificationChannelEnum = zod_1.z.enum(["EMAIL", "SMS", "WHATSAPP"]);
exports.notificationPriorityEnum = zod_1.z.enum(["NORMAL", "HIGH", "CRITICAL"]);
exports.notificationStatusEnum = zod_1.z.enum([
    "DRAFT",
    "SCHEDULED",
    "QUEUED",
    "SENT",
    "FAILED",
    "CANCELLED",
]);
exports.notificationTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    slug: zod_1.z.string().min(3),
    type: exports.notificationTypeEnum,
    channel: exports.notificationChannelEnum,
    subject: zod_1.z.string().optional().nullable(),
    body: zod_1.z.string().min(5),
    tokens: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.scheduleNotificationSchema = zod_1.z.object({
    templateSlug: zod_1.z.string().min(3).optional(),
    type: exports.notificationTypeEnum.optional(),
    channel: exports.notificationChannelEnum.optional(),
    priority: exports.notificationPriorityEnum.optional(),
    subject: zod_1.z.string().optional(),
    body: zod_1.z.string().optional(),
    tokens: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    scheduledAt: zod_1.z.coerce.date().optional(),
    sendNow: zod_1.z.boolean().optional(),
    recipientName: zod_1.z.string().optional(),
    recipientEmail: zod_1.z.string().email().optional(),
    recipientPhone: zod_1.z.string().min(5).optional(),
    bookingId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid().optional(),
});
exports.listNotificationsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
    status: exports.notificationStatusEnum.optional(),
    type: exports.notificationTypeEnum.optional(),
    search: zod_1.z.string().optional(),
});
exports.sosSchema = zod_1.z.object({
    message: zod_1.z.string().min(5),
    recipientPhone: zod_1.z.string().min(5).optional(),
    recipientEmail: zod_1.z.string().email().optional(),
    bookingId: zod_1.z.string().uuid().optional(),
}).refine((data) => data.recipientPhone || data.recipientEmail, {
    message: "Recipient phone or email is required",
    path: ["recipientPhone"],
});
//# sourceMappingURL=notification.validation.js.map