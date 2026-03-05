/**
 * Invoice Mapper - Transforms DTOs to DB models
 * This is where API DTO is converted to database format
 */
import { Prisma } from "@prisma/client";
import { CreateInvoiceDTO, UpdateInvoiceStatusDTO, CreateTransactionDTO } from "./invoice.dto";
/**
 * Generate unique invoice number in format: INV-2026-00001
 */
export declare const generateInvoiceNumber: () => Promise<string>;
/**
 * Map API CreateInvoiceDTO to Prisma create input
 */
export declare const mapCreateDTOToDb: (dto: CreateInvoiceDTO, bookingRef: string) => Promise<Prisma.InvoiceCreateInput>;
/**
 * Map API UpdateInvoiceStatusDTO to Prisma update input
 */
export declare const mapUpdateStatusDTOToDb: (dto: UpdateInvoiceStatusDTO) => Prisma.InvoiceUpdateInput;
/**
 * Map API CreateTransactionDTO to Prisma create input
 */
export declare const mapCreateTransactionDTOToDb: (dto: CreateTransactionDTO) => Prisma.TransactionCreateInput;
/**
 * Map API UpdateTransactionDTO to Prisma update input
 */
export declare const mapUpdateTransactionDTOToDb: (dto: any) => Prisma.TransactionUpdateInput;
//# sourceMappingURL=invoice.mapper.d.ts.map