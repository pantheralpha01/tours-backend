"use strict";
/**
 * Invoice Mapper - Transforms DTOs to DB models
 * This is where API DTO is converted to database format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUpdateTransactionDTOToDb = exports.mapCreateTransactionDTOToDb = exports.mapUpdateStatusDTOToDb = exports.mapCreateDTOToDb = exports.generateInvoiceNumber = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
/**
 * Generate unique invoice number in format: INV-2026-00001
 */
const generateInvoiceNumber = async () => {
    const count = await prisma_1.prisma.invoice.count();
    const year = new Date().getFullYear();
    const number = String(count + 1).padStart(5, "0");
    return `INV-${year}-${number}`;
};
exports.generateInvoiceNumber = generateInvoiceNumber;
/**
 * Map API CreateInvoiceDTO to Prisma create input
 */
const mapCreateDTOToDb = async (dto, bookingRef) => {
    return {
        invoiceNumber: await (0, exports.generateInvoiceNumber)(),
        bookingRef,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        status: "DRAFT",
        totalAmount: new client_1.Prisma.Decimal(dto.totalAmount.toString()),
        depositAmount: dto.depositAmount
            ? new client_1.Prisma.Decimal(dto.depositAmount.toString())
            : null,
        balanceAmount: dto.balanceAmount
            ? new client_1.Prisma.Decimal(dto.balanceAmount.toString())
            : null,
        paidAmount: new client_1.Prisma.Decimal("0"),
        currency: "USD",
        dueDate: dto.dueDate,
        metadata: dto.notes ? { notes: dto.notes } : null,
        booking: {
            connect: { id: dto.bookingId },
        },
    };
};
exports.mapCreateDTOToDb = mapCreateDTOToDb;
/**
 * Map API UpdateInvoiceStatusDTO to Prisma update input
 */
const mapUpdateStatusDTOToDb = (dto) => {
    return {
        status: dto.status,
        metadata: dto.transitionReason ? { transitionReason: dto.transitionReason } : null,
    };
};
exports.mapUpdateStatusDTOToDb = mapUpdateStatusDTOToDb;
/**
 * Map API CreateTransactionDTO to Prisma create input
 */
const mapCreateTransactionDTOToDb = (dto) => {
    return {
        transactionId: dto.transactionId,
        bookingRef: "", // Will be set by service after fetching invoice
        type: dto.type,
        amount: new client_1.Prisma.Decimal(dto.amount.toString()),
        currency: (dto.currency || "KES"),
        status: (dto.status || "PENDING"),
        paymentMethod: dto.paymentMethod,
        reference: dto.reference,
        metadata: dto.metadata,
        invoice: {
            connect: { id: dto.invoiceId },
        },
    };
};
exports.mapCreateTransactionDTOToDb = mapCreateTransactionDTOToDb;
/**
 * Map API UpdateTransactionDTO to Prisma update input
 */
const mapUpdateTransactionDTOToDb = (dto) => {
    if (!dto.status && !dto.metadata) {
        return {};
    }
    return {
        ...(dto.status && { status: dto.status }),
        ...(dto.metadata && { metadata: dto.metadata }),
    };
};
exports.mapUpdateTransactionDTOToDb = mapUpdateTransactionDTOToDb;
//# sourceMappingURL=invoice.mapper.js.map