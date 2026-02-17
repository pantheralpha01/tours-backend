import { z } from "zod";
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export type PaginatedResponse<T> = {
    data: T[];
    meta: PaginationMeta;
};
export declare const calculatePagination: (total: number, page: number, limit: number) => PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map