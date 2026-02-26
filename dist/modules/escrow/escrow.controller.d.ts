import { Request, Response } from "express";
export declare const escrowController: {
    getByBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    release: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updatePayoutStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    cancel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=escrow.controller.d.ts.map