import { Request, Response, NextFunction } from "express";
export declare const bookingController: {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    calendar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    transition: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
//# sourceMappingURL=booking.controller.d.ts.map