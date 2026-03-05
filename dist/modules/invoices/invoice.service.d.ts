/**
 * Invoice Service - REFACTORED
 * Focuses on business logic orchestration, delegates DB transformation to mapper
 * Follows the roadmap: service layer + repository pattern + DTOs
 */
import { Invoice, Transaction } from "@prisma/client";
import { PaginatedResponse } from "../../utils/pagination";
import { CreateInvoiceDTO, UpdateInvoiceStatusDTO, CreateTransactionDTO, UpdateTransactionDTO } from "./invoice.dto";
export declare const invoiceService: {
    create: (input: CreateInvoiceDTO) => Promise<Invoice>;
    getById: (id: string) => Promise<Invoice>;
    getByBookingId: (bookingId: string, skip?: number, take?: number) => Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    list: (filters?: {
        status?: string;
        customerEmail?: string;
        bookingId?: string;
    }, skip?: number, take?: number) => Promise<PaginatedResponse<Invoice>>;
    updateStatus: (invoiceId: string, input: UpdateInvoiceStatusDTO) => Promise<Invoice>;
    send: (invoiceId: string, paymentLink?: string) => Promise<Invoice>;
    remove: (invoiceId: string) => Promise<void>;
    createTransaction: (input: CreateTransactionDTO) => Promise<Transaction>;
    getTransactionById: (id: string) => Promise<Transaction>;
    listTransactions: (invoiceId: string, skip?: number, take?: number) => Promise<PaginatedResponse<Transaction>>;
    updateTransaction: (transactionId: string, input: UpdateTransactionDTO) => Promise<Transaction>;
};
//# sourceMappingURL=invoice.service.d.ts.map