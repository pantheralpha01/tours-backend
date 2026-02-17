import { z } from "zod";
export declare const createBookingSchema: z.ZodObject<{
    customerName: z.ZodString;
    serviceTitle: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "CONFIRMED", "CANCELLED"]>>;
    paymentStatus: z.ZodOptional<z.ZodEnum<["UNPAID", "PAID"]>>;
    agentId: z.ZodOptional<z.ZodString>;
    serviceStartAt: z.ZodOptional<z.ZodDate>;
    serviceEndAt: z.ZodOptional<z.ZodDate>;
    serviceTimezone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    serviceTitle: string;
    amount: number;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED" | undefined;
    paymentStatus?: "UNPAID" | "PAID" | undefined;
    agentId?: string | undefined;
    serviceStartAt?: Date | undefined;
    serviceEndAt?: Date | undefined;
    serviceTimezone?: string | undefined;
}, {
    customerName: string;
    serviceTitle: string;
    amount: number;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED" | undefined;
    paymentStatus?: "UNPAID" | "PAID" | undefined;
    agentId?: string | undefined;
    serviceStartAt?: Date | undefined;
    serviceEndAt?: Date | undefined;
    serviceTimezone?: string | undefined;
}>;
export declare const updateBookingSchema: z.ZodObject<{
    customerName: z.ZodOptional<z.ZodString>;
    serviceTitle: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "CONFIRMED", "CANCELLED"]>>;
    paymentStatus: z.ZodOptional<z.ZodEnum<["UNPAID", "PAID"]>>;
    agentId: z.ZodOptional<z.ZodString>;
    serviceStartAt: z.ZodOptional<z.ZodDate>;
    serviceEndAt: z.ZodOptional<z.ZodDate>;
    serviceTimezone: z.ZodOptional<z.ZodString>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerName?: string | undefined;
    serviceTitle?: string | undefined;
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED" | undefined;
    paymentStatus?: "UNPAID" | "PAID" | undefined;
    agentId?: string | undefined;
    serviceStartAt?: Date | undefined;
    serviceEndAt?: Date | undefined;
    serviceTimezone?: string | undefined;
    transitionReason?: string | undefined;
}, {
    customerName?: string | undefined;
    serviceTitle?: string | undefined;
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED" | undefined;
    paymentStatus?: "UNPAID" | "PAID" | undefined;
    agentId?: string | undefined;
    serviceStartAt?: Date | undefined;
    serviceEndAt?: Date | undefined;
    serviceTimezone?: string | undefined;
    transitionReason?: string | undefined;
}>;
export declare const transitionBookingSchema: z.ZodObject<{
    toStatus: z.ZodEnum<["DRAFT", "CONFIRMED", "CANCELLED"]>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    toStatus: "DRAFT" | "CONFIRMED" | "CANCELLED";
    transitionReason?: string | undefined;
}, {
    toStatus: "DRAFT" | "CONFIRMED" | "CANCELLED";
    transitionReason?: string | undefined;
}>;
export declare const bookingIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const listBookingSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    serviceStartFrom: z.ZodOptional<z.ZodDate>;
    serviceStartTo: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    serviceStartFrom?: Date | undefined;
    serviceStartTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    serviceStartFrom?: Date | undefined;
    serviceStartTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const calendarBookingSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    serviceStartFrom: z.ZodOptional<z.ZodDate>;
    serviceStartTo: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    serviceStartFrom?: Date | undefined;
    serviceStartTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    serviceStartFrom?: Date | undefined;
    serviceStartTo?: Date | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=booking.validation.d.ts.map