/**
 * Data Transfer Objects (DTOs) for Invoice API
 * Separate from DB model to decouple API from database
 */

export interface CreateInvoiceDTO {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  dueDate: Date;
  notes?: string;
}

export interface UpdateInvoiceStatusDTO {
  status: "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
  transitionReason?: string;
}

export interface SendInvoiceDTO {
  invoiceId: string;
  paymentLink?: string;
  customMessage?: string;
}

export interface CreateTransactionDTO {
  invoiceId: string;
  transactionId: string;
  type: "DEPOSIT" | "BALANCE";
  amount: number;
  currency?: "USD" | "KES";
  status?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentMethod?: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface UpdateTransactionDTO {
  status?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  metadata?: Record<string, any>;
}

export interface InvoiceResponseDTO {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: string;
  dueDate: Date;
  sentAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponseDTO {
  id: string;
  invoiceId: string;
  transactionId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}
