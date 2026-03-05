/**
 * Invoice Controller - REFACTORED
 * Clean layer that validates API input and delegates all business logic to service
 * Follows: validation -> service -> response
 */
import { Request, Response, NextFunction } from "express";
export declare const invoiceController: {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getByBookingId: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    send: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    recordPayment: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
//# sourceMappingURL=invoice.controller.d.ts.map