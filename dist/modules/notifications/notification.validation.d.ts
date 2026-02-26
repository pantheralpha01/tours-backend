import { z } from "zod";
export declare const notificationTypeEnum: z.ZodEnum<["REMINDER", "PROMO", "SOS", "COMMUNITY"]>;
export declare const notificationChannelEnum: z.ZodEnum<["EMAIL", "SMS", "WHATSAPP"]>;
export declare const notificationPriorityEnum: z.ZodEnum<["NORMAL", "HIGH", "CRITICAL"]>;
export declare const notificationStatusEnum: z.ZodEnum<["DRAFT", "SCHEDULED", "QUEUED", "SENT", "FAILED", "CANCELLED"]>;
export declare const notificationTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    type: z.ZodEnum<["REMINDER", "PROMO", "SOS", "COMMUNITY"]>;
    channel: z.ZodEnum<["EMAIL", "SMS", "WHATSAPP"]>;
    subject: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    body: z.ZodString;
    tokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    type: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY";
    channel: "EMAIL" | "SMS" | "WHATSAPP";
    body: string;
    metadata?: Record<string, any> | undefined;
    subject?: string | null | undefined;
    tokens?: Record<string, any> | undefined;
}, {
    name: string;
    slug: string;
    type: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY";
    channel: "EMAIL" | "SMS" | "WHATSAPP";
    body: string;
    metadata?: Record<string, any> | undefined;
    subject?: string | null | undefined;
    tokens?: Record<string, any> | undefined;
}>;
export declare const scheduleNotificationSchema: z.ZodObject<{
    templateSlug: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["REMINDER", "PROMO", "SOS", "COMMUNITY"]>>;
    channel: z.ZodOptional<z.ZodEnum<["EMAIL", "SMS", "WHATSAPP"]>>;
    priority: z.ZodOptional<z.ZodEnum<["NORMAL", "HIGH", "CRITICAL"]>>;
    subject: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    tokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    scheduledAt: z.ZodOptional<z.ZodDate>;
    sendNow: z.ZodOptional<z.ZodBoolean>;
    recipientName: z.ZodOptional<z.ZodString>;
    recipientEmail: z.ZodOptional<z.ZodString>;
    recipientPhone: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    type?: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY" | undefined;
    channel?: "EMAIL" | "SMS" | "WHATSAPP" | undefined;
    subject?: string | undefined;
    body?: string | undefined;
    tokens?: Record<string, any> | undefined;
    priority?: "NORMAL" | "HIGH" | "CRITICAL" | undefined;
    scheduledAt?: Date | undefined;
    recipientName?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
    userId?: string | undefined;
    templateSlug?: string | undefined;
    sendNow?: boolean | undefined;
}, {
    bookingId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    type?: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY" | undefined;
    channel?: "EMAIL" | "SMS" | "WHATSAPP" | undefined;
    subject?: string | undefined;
    body?: string | undefined;
    tokens?: Record<string, any> | undefined;
    priority?: "NORMAL" | "HIGH" | "CRITICAL" | undefined;
    scheduledAt?: Date | undefined;
    recipientName?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
    userId?: string | undefined;
    templateSlug?: string | undefined;
    sendNow?: boolean | undefined;
}>;
export declare const listNotificationsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SCHEDULED", "QUEUED", "SENT", "FAILED", "CANCELLED"]>>;
    type: z.ZodOptional<z.ZodEnum<["REMINDER", "PROMO", "SOS", "COMMUNITY"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SCHEDULED" | "FAILED" | "QUEUED" | undefined;
    type?: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY" | undefined;
    page?: number | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SCHEDULED" | "FAILED" | "QUEUED" | undefined;
    type?: "REMINDER" | "PROMO" | "SOS" | "COMMUNITY" | undefined;
    page?: number | undefined;
}>;
export declare const sosSchema: z.ZodEffects<z.ZodObject<{
    message: z.ZodString;
    recipientPhone: z.ZodOptional<z.ZodString>;
    recipientEmail: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    bookingId?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
}, {
    message: string;
    bookingId?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
}>, {
    message: string;
    bookingId?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
}, {
    message: string;
    bookingId?: string | undefined;
    recipientEmail?: string | undefined;
    recipientPhone?: string | undefined;
}>;
//# sourceMappingURL=notification.validation.d.ts.map