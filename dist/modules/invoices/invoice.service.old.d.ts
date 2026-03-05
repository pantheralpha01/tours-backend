import { Invoice, Transaction, InvoiceStatus } from "@prisma/client";
export declare const invoiceService: {
    /**
     * Create a new invoice from a booking
     */
    create: (data: {
        bookingId: string;
        customerName: string;
        customerEmail: string;
        totalAmount: number;
        depositAmount: number;
        balanceAmount: number;
        dueDate: Date;
        notes?: string;
    }) => Promise<Invoice>;
    /**
     * Get invoice by ID
     */
    getById: (id: string) => Promise<Invoice>;
    /**
     * Get invoices by booking ID
     */
    getByBookingId: (bookingId: string, skip?: number, take?: number) => Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    /**
     * List all invoices with filters
     */
    list: (filters?: {
        status?: string;
        customerEmail?: string;
        bookingId?: string;
    }, skip?: number, take?: number) => Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    /**
     * Send invoice (update status and set sentAt)
     */
    send: (invoiceId: string, paymentLink?: string) => Promise<Invoice>;
    /**
     * Update invoice status
     */
    updateStatus: (invoiceId: string, status: InvoiceStatus) => Promise<Invoice>;
    /**
     * Handle payment for invoice (create transaction and update invoice)
     */
    recordPayment: (data: {
        invoiceId: string;
        transactionId: string;
        type: "DEPOSIT" | "BALANCE";
        amount: number;
        currency?: string;
        paymentMethod?: string;
        reference?: string;
    }) => Promise<{
        transaction: Transaction;
        invoice: Invoice;
    }>;
    /**
     * Get invoice transactions
     */
    getTransactions: (invoiceId: string) => Promise<Transaction[]>;
    /**
     * Delete invoice (only if in DRAFT status)
     */
    delete: (invoiceId: string) => Promise<void>;
};
export declare const transactionService: {
    /**
     * Create transaction from webhook
     */
    create: (data: {
        invoiceId: string;
        transactionId: string;
        bookingRef: string;
        type: "DEPOSIT" | "BALANCE";
        amount: number;
        currency?: string;
        status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
        paymentMethod?: string;
        reference?: string;
        metadata?: Record<string, any>;
    }) => Promise<Transaction>;
    /**
     * Get transaction by ID
     */
    getById: (id: string) => Promise<Transaction>;
    /**
     * Get transaction by external ID
     */
    getByTransactionId: (transactionId: string) => Promise<Transaction>;
    /**
     * Update transaction status from webhook
     */
    updateStatus: (transactionId: string, status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED", metadata?: Record<string, any>) => Promise<Transaction>;
    /**
     * Delete transaction
     */
    delete: (id: string) => Promise<void>;
};
//# sourceMappingURL=invoice.service.old.d.ts.map