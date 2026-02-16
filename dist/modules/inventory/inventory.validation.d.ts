import { z } from "zod";
export declare const createInventorySchema: z.ZodObject<{
    partnerId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "ACTIVE", "INACTIVE"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    partnerId: string;
    price: number;
    status?: "DRAFT" | "ACTIVE" | "INACTIVE" | undefined;
    description?: string | undefined;
}, {
    title: string;
    partnerId: string;
    price: number;
    status?: "DRAFT" | "ACTIVE" | "INACTIVE" | undefined;
    description?: string | undefined;
}>;
export declare const updateInventorySchema: z.ZodObject<{
    partnerId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "ACTIVE", "INACTIVE"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "ACTIVE" | "INACTIVE" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    partnerId?: string | undefined;
    price?: number | undefined;
}, {
    status?: "DRAFT" | "ACTIVE" | "INACTIVE" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    partnerId?: string | undefined;
    price?: number | undefined;
}>;
export declare const inventoryIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=inventory.validation.d.ts.map