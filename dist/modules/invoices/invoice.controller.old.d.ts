import { Request, Response } from "express";
export declare const invoiceController: {
    /**
     * POST /api/invoices
     * Create a new invoice from a booking
     */
    create: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/invoices/:id
     * Get invoice by ID
     */
    getById: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/invoices
     * List invoices with filters
     */
    list: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/invoices/booking/:bookingId
     * Get invoices for a specific booking
     */
    getByBookingId: (req: Request, res: Response) => Promise<void>;
    /**
     * PATCH /api/invoices/:id/send
     * Send invoice (mark as sent and generate payment link)
     */
    send: (req: Request, res: Response) => Promise<void>;
    /**
     * PATCH /api/invoices/:id/status
     * Update invoice status
     */
    updateStatus: (req: Request, res: Response) => Promise<void>;
    /**
     * POST /api/invoices/:id/payments
     * Record a payment for an invoice
     */
    recordPayment: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/invoices/:id/transactions
     * Get transactions for an invoice
     */
    getTransactions: (req: Request, res: Response) => Promise<void>;
    /**
     * DELETE /api/invoices/:id
     * Delete invoice (only if in DRAFT status)
     */
    delete: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=invoice.controller.old.d.ts.map