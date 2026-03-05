import { Invoice, Transaction, InvoiceStatus, PaymentState, TransactionType, Currency } from "@prisma/client";
export declare const invoiceRepository: {
    create: (data: {
        bookingId: string;
        invoiceNumber: string;
        bookingRef: string;
        customerName: string;
        customerEmail: string;
        totalAmount: number;
        depositAmount: number;
        balanceAmount: number;
        dueDate: Date;
        notes?: string;
    }) => Promise<Invoice>;
    findById: (id: string) => Promise<Invoice | null>;
    findByInvoiceNumber: (invoiceNumber: string) => Promise<Invoice | null>;
    findByBookingId: (bookingId: string, skip?: number, take?: number) => Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    findMany: (filters?: {
        status?: string;
        customerEmail?: string;
        bookingId?: string;
    }, skip?: number, take?: number) => Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    updateStatus: (id: string, status: InvoiceStatus) => Promise<Invoice>;
    updatePaymentInfo: (id: string, data: {
        paidAmount?: number;
        status?: InvoiceStatus;
        sentAt?: Date | null;
        paidAt?: Date | null;
        paymentLink?: string;
    }) => Promise<Invoice>;
    delete: (id: string) => Promise<Invoice>;
};
export declare const transactionRepository: {
    create: (data: {
        invoiceId: string;
        transactionId: string;
        bookingRef: string;
        type: TransactionType;
        amount: number;
        currency: Currency;
        status: PaymentState;
        paymentMethod?: string;
        reference?: string;
        metadata?: Record<string, any>;
    }) => Promise<Transaction>;
    findById: (id: string) => Promise<Transaction | null>;
    findByTransactionId: (transactionId: string) => Promise<Transaction | null>;
    findByInvoiceId: (invoiceId: string) => Promise<Transaction[]>;
    updateStatus: (id: string, status: PaymentState, metadata?: Record<string, any>) => Promise<Transaction>;
    delete: (id: string) => Promise<Transaction>;
};
//# sourceMappingURL=invoice.repository.d.ts.map