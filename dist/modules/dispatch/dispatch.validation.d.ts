import { z } from "zod";
export declare const createDispatchSchema: z.ZodObject<{
    bookingId: z.ZodString;
    assignedToId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    notes: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    notes?: string | undefined;
    assignedToId?: string | undefined;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
}, {
    bookingId: string;
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    notes?: string | undefined;
    assignedToId?: string | undefined;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
}>;
export declare const updateDispatchSchema: z.ZodObject<{
    assignedToId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    notes: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    notes?: string | undefined;
    assignedToId?: string | undefined;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
    transitionReason?: string | undefined;
}, {
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    notes?: string | undefined;
    assignedToId?: string | undefined;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
    transitionReason?: string | undefined;
}>;
export declare const dispatchIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const listDispatchSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]>>;
    assignedToId: z.ZodOptional<z.ZodString>;
    bookingId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: string | undefined;
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    bookingId?: string | undefined;
    assignedToId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    sort?: string | undefined;
    limit?: number | undefined;
    status?: "CANCELLED" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | undefined;
    bookingId?: string | undefined;
    assignedToId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const createTrackPointSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    recordedAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    latitude: number;
    longitude: number;
    metadata?: Record<string, any> | undefined;
    recordedAt?: Date | undefined;
}, {
    latitude: number;
    longitude: number;
    metadata?: Record<string, any> | undefined;
    recordedAt?: Date | undefined;
}>;
//# sourceMappingURL=dispatch.validation.d.ts.map