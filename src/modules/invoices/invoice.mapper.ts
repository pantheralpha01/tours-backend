/**
 * Invoice Mapper - Transforms DTOs to DB models
 * This is where API DTO is converted to database format
 */

import { Prisma } from "@prisma/client";
import { CreateInvoiceDTO, UpdateInvoiceStatusDTO, CreateTransactionDTO } from "./invoice.dto";
import { prisma } from "../../config/prisma";

/**
 * Generate unique invoice number in format: INV-2026-00001
 */
export const generateInvoiceNumber = async (): Promise<string> => {
  const count = await prisma.invoice.count();
  const year = new Date().getFullYear();
  const number = String(count + 1).padStart(5, "0");
  return `INV-${year}-${number}`;
};

/**
 * Map API CreateInvoiceDTO to Prisma create input
 */
export const mapCreateDTOToDb = async (
  dto: CreateInvoiceDTO,
  bookingRef: string
): Promise<Prisma.InvoiceCreateInput> => {
  return {
    invoiceNumber: await generateInvoiceNumber(),
    bookingRef,
    customerName: dto.customerName,
    customerEmail: dto.customerEmail,
    status: "DRAFT" as any,
    totalAmount: new Prisma.Decimal(dto.totalAmount.toString()),
    depositAmount: dto.depositAmount
      ? new Prisma.Decimal(dto.depositAmount.toString())
      : null,
    balanceAmount: dto.balanceAmount
      ? new Prisma.Decimal(dto.balanceAmount.toString())
      : null,
    paidAmount: new Prisma.Decimal("0"),
    currency: "USD" as any,
    dueDate: dto.dueDate,
    metadata: dto.notes ? { notes: dto.notes } : null,
    booking: {
      connect: { id: dto.bookingId },
    },
  };
};

/**
 * Map API UpdateInvoiceStatusDTO to Prisma update input
 */
export const mapUpdateStatusDTOToDb = (
  dto: UpdateInvoiceStatusDTO
): Prisma.InvoiceUpdateInput => {
  return {
    status: dto.status as any,
    metadata: dto.transitionReason ? { transitionReason: dto.transitionReason } : null,
  };
};

/**
 * Map API CreateTransactionDTO to Prisma create input
 */
export const mapCreateTransactionDTOToDb = (
  dto: CreateTransactionDTO
): Prisma.TransactionCreateInput => {
  return {
    transactionId: dto.transactionId,
    bookingRef: "", // Will be set by service after fetching invoice
    type: dto.type as any,
    amount: new Prisma.Decimal(dto.amount.toString()),
    currency: (dto.currency || "KES") as any,
    status: (dto.status || "PENDING") as any,
    paymentMethod: dto.paymentMethod,
    reference: dto.reference,
    metadata: dto.metadata,
    invoice: {
      connect: { id: dto.invoiceId },
    },
  };
};

/**
 * Map API UpdateTransactionDTO to Prisma update input
 */
export const mapUpdateTransactionDTOToDb = (
  dto: any
): Prisma.TransactionUpdateInput => {
  if (!dto.status && !dto.metadata) {
    return {};
  }

  return {
    ...(dto.status && { status: dto.status as any }),
    ...(dto.metadata && { metadata: dto.metadata }),
  };
};
