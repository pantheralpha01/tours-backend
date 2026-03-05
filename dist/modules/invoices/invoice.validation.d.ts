import { z } from "zod";
export declare const invoiceStatusEnum: z.ZodEnum<["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE"]>;
export declare const transactionTypeEnum: z.ZodEnum<["DEPOSIT", "BALANCE"]>;
export declare const createInvoiceSchema: z.ZodObject<{
    bookingId: z.ZodString;
    customerName: z.ZodString;
    customerEmail: z.ZodString;
    totalAmount: z.ZodNumber;
    depositAmount: z.ZodNumber;
    balanceAmount: z.ZodNumber;
    dueDate: z.ZodDate;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    customerEmail: string;
    depositAmount: number;
    balanceAmount: number;
    bookingId: string;
    totalAmount: number;
    dueDate: Date;
    notes?: string | undefined;
}, {
    customerName: string;
    customerEmail: string;
    depositAmount: number;
    balanceAmount: number;
    bookingId: string;
    totalAmount: number;
    dueDate: Date;
    notes?: string | undefined;
}>;
export declare const updateInvoiceStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE"]>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE";
    transitionReason?: string | undefined;
}, {
    status: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE";
    transitionReason?: string | undefined;
}>;
export declare const invoiceIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const sendInvoiceSchema: z.ZodObject<{
    invoiceId: z.ZodString;
    paymentLink: z.ZodOptional<z.ZodString>;
    customMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    invoiceId: string;
    paymentLink?: string | undefined;
    customMessage?: string | undefined;
}, {
    invoiceId: string;
    paymentLink?: string | undefined;
    customMessage?: string | undefined;
}>;
export declare const listInvoicesSchema: z.ZodObject<{
    bookingId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE"]>>;
    customerEmail: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    customerEmail?: string | undefined;
    status?: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE" | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    customerEmail?: string | undefined;
    status?: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE" | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const invoiceQuerySchema: z.ZodObject<{
    bookingId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE"]>>;
    customerEmail: z.ZodOptional<z.ZodString>;
    skip: z.ZodDefault<z.ZodNumber>;
    take: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    skip: number;
    take: number;
    customerEmail?: string | undefined;
    status?: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE" | undefined;
    bookingId?: string | undefined;
}, {
    skip?: number | undefined;
    take?: number | undefined;
    customerEmail?: string | undefined;
    status?: "DRAFT" | "PAID" | "SENT" | "PARTIALLY_PAID" | "OVERDUE" | undefined;
    bookingId?: string | undefined;
}>;
export declare const createTransactionSchema: z.ZodObject<{
    invoiceId: z.ZodString;
    transactionId: z.ZodString;
    type: z.ZodEnum<["DEPOSIT", "BALANCE"]>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["USD", "KES"]>>;
    status: z.ZodDefault<z.ZodEnum<["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]>>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: "USD" | "KES";
    status: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED";
    type: "DEPOSIT" | "BALANCE";
    invoiceId: string;
    transactionId: string;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
    paymentMethod?: string | undefined;
}, {
    amount: number;
    type: "DEPOSIT" | "BALANCE";
    invoiceId: string;
    transactionId: string;
    currency?: "USD" | "KES" | undefined;
    status?: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
    paymentMethod?: string | undefined;
}>;
export declare const updateTransactionSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status?: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED" | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    status?: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED" | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const transactionIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatus = z.infer<typeof updateInvoiceStatusSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type ListInvoicesQuery = z.infer<typeof invoiceQuerySchema>;
//# sourceMappingURL=invoice.validation.d.ts.map