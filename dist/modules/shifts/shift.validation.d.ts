import { z } from "zod";
export declare const shiftStatusEnum: z.ZodEnum<["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>;
export declare const createShiftSchema: z.ZodEffects<z.ZodType<{
    startAt: Date;
    endAt: Date;
    notes?: string | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
}, z.ZodTypeDef, {
    startAt: Date;
    endAt: Date;
    notes?: string | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
}>, {
    startAt: Date;
    endAt: Date;
    notes?: string | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
}, {
    startAt: Date;
    endAt: Date;
    notes?: string | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
}>;
export declare const updateShiftSchema: z.ZodEffects<z.ZodType<{
    notes?: string | null | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | null | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
}, z.ZodTypeDef, {
    notes?: string | null | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | null | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
}>, {
    notes?: string | null | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | null | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
}, {
    notes?: string | null | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | null | undefined;
    startAt?: Date | undefined;
    endAt?: Date | undefined;
}>;
export declare const shiftIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const listShiftSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    agentId: z.ZodOptional<z.ZodString>;
    startFrom: z.ZodOptional<z.ZodDate>;
    startTo: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodEnum<["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    bookingId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    startFrom?: Date | undefined;
    startTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
    startFrom?: Date | undefined;
    startTo?: Date | undefined;
}>;
//# sourceMappingURL=shift.validation.d.ts.map