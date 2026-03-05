/**
 * Invoice Controller - REFACTORED
 * Clean layer that validates API input and delegates all business logic to service
 * Follows: validation -> service -> response
 */

import { Request, Response, NextFunction } from "express";
import { invoiceService } from "./invoice.service";
import {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
  invoiceIdSchema,
  sendInvoiceSchema,
  listInvoicesSchema,
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdSchema,
} from "./invoice.validation";
import { ApiError } from "../../utils/ApiError";
import { paginationSchema } from "../../utils/pagination";

/**
 * Create a new invoice
 * POST /api/invoices
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate API input
    const payload = createInvoiceSchema.parse(req.body);

    // Call service
    const invoice = await invoiceService.create(payload);

    return res.status(201).json(invoice);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get invoice by ID
 * GET /api/invoices/:id
 */
const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = invoiceIdSchema.parse(req.params);
    const invoice = await invoiceService.getById(id);

    return res.status(200).json(invoice);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get invoices for a booking
 * GET /api/invoices/booking/:bookingId
 */
const getByBookingId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const params = paginationSchema.parse(req.query);

    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const result = await invoiceService.getByBookingId(bookingId, skip, take);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * List all invoices with filters
 * GET /api/invoices
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = listInvoicesSchema.parse(req.query);

    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const result = await invoiceService.list(
      {
        status: params.status,
        customerEmail: params.customerEmail,
        bookingId: params.bookingId,
      },
      skip,
      take
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update invoice status (transition)
 * PATCH /api/invoices/:id/status
 */
const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = invoiceIdSchema.parse(req.params);
    const payload = updateInvoiceStatusSchema.parse(req.body);

    const invoice = await invoiceService.updateStatus(id, payload);

    return res.status(200).json(invoice);
  } catch (error) {
    return next(error);
  }
};

/**
 * Send invoice to customer
 * POST /api/invoices/:id/send
 */
const send = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = invoiceIdSchema.parse(req.params);
    const { paymentLink, customMessage } = sendInvoiceSchema.parse(req.body);

    const invoice = await invoiceService.send(id, paymentLink);

    return res.status(200).json(invoice);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = invoiceIdSchema.parse(req.params);

    await invoiceService.remove(id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/**
 * Record payment/transaction for invoice
 * POST /api/invoices/:id/payments
 */
const recordPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { invoiceId, transactionId, type, amount, currency, status, paymentMethod, reference, metadata } = createTransactionSchema.parse(req.body);

    const transaction = await invoiceService.createTransaction({
      invoiceId,
      transactionId,
      type,
      amount,
      currency,
      status,
      paymentMethod,
      reference,
      metadata,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get transactions for an invoice
 * GET /api/invoices/:id/transactions
 */
const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const params = paginationSchema.parse(req.query);

    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const result = await invoiceService.listTransactions(id, skip, take);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = invoiceIdSchema.parse(req.params);

    await invoiceService.remove(id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const invoiceController = {
  create,
  getById,
  getByBookingId,
  list,
  updateStatus,
  send,
  recordPayment,
  getTransactions,
  delete: deleteInvoice,
};
