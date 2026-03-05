import { Request, Response } from "express";
import { invoiceService } from "./invoice.service";
import {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
  invoiceIdSchema,
} from "./invoice.validation";
import { ApiError } from "../../utils/ApiError";

export const invoiceController = {
  /**
   * POST /api/invoices
   * Create a new invoice from a booking
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = createInvoiceSchema.parse(req.body);
      const invoice = await invoiceService.create(parsed);

      res.status(201).json({
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * GET /api/invoices/:id
   * Get invoice by ID
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      const invoice = await invoiceService.getById(id);

      res.json({
        message: "Invoice retrieved successfully",
        data: invoice,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * GET /api/invoices
   * List invoices with filters
   */
  list: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, customerEmail, bookingId, skip = 0, take = 10 } = req.query;

      const skipNum = typeof skip === "string" ? parseInt(skip, 10) : 0;
      const takeNum = typeof take === "string" ? parseInt(take, 10) : 10;

      const { invoices, total } = await invoiceService.list(
        {
          status: typeof status === "string" ? status : undefined,
          customerEmail: typeof customerEmail === "string" ? customerEmail : undefined,
          bookingId: typeof bookingId === "string" ? bookingId : undefined,
        },
        skipNum,
        takeNum
      );

      res.json({
        message: "Invoices retrieved successfully",
        data: invoices,
        pagination: {
          skip: skipNum,
          take: takeNum,
          total,
          pages: Math.ceil(total / takeNum),
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * GET /api/invoices/booking/:bookingId
   * Get invoices for a specific booking
   */
  getByBookingId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const skipNum = typeof skip === "string" ? parseInt(skip, 10) : 0;
      const takeNum = typeof take === "string" ? parseInt(take, 10) : 10;

      const { invoices, total } = await invoiceService.getByBookingId(
        bookingId,
        skipNum,
        takeNum
      );

      res.json({
        message: "Invoices retrieved successfully",
        data: invoices,
        pagination: {
          skip: skipNum,
          take: takeNum,
          total,
          pages: Math.ceil(total / takeNum),
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * PATCH /api/invoices/:id/send
   * Send invoice (mark as sent and generate payment link)
   */
  send: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      const { paymentLink } = req.body;

      const invoice = await invoiceService.send(id, paymentLink);

      res.json({
        message: "Invoice sent successfully",
        data: invoice,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * PATCH /api/invoices/:id/status
   * Update invoice status
   */
  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      const { status } = updateInvoiceStatusSchema.parse(req.body);

      const invoice = await invoiceService.updateStatus(id, status);

      res.json({
        message: "Invoice status updated successfully",
        data: invoice,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * POST /api/invoices/:id/payments
   * Record a payment for an invoice
   */
  recordPayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      const paymentData = {
        invoiceId: id,
        ...req.body,
      };

      // Validate manually since we need the ID from params
      if (typeof paymentData.transactionId !== "string") {
        throw ApiError.badRequest("Transaction ID is required");
      }
      if (!["DEPOSIT", "BALANCE"].includes(paymentData.type)) {
        throw ApiError.badRequest("Invalid transaction type");
      }
      if (typeof paymentData.amount !== "number" || paymentData.amount <= 0) {
        throw ApiError.badRequest("Amount must be a positive number");
      }

      const { transaction, invoice } = await invoiceService.recordPayment(
        paymentData
      );

      res.status(201).json({
        message: "Payment recorded successfully",
        data: {
          transaction,
          invoice,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * GET /api/invoices/:id/transactions
   * Get transactions for an invoice
   */
  getTransactions: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      const transactions = await invoiceService.getTransactions(id);

      res.json({
        message: "Transactions retrieved successfully",
        data: transactions,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },

  /**
   * DELETE /api/invoices/:id
   * Delete invoice (only if in DRAFT status)
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = invoiceIdSchema.parse(req.params);
      await invoiceService.delete(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          message: error.message,
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  },
};
