import { Request, Response } from "express";
export declare const integrationController: {
    sendWhatsapp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    respondWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    airtableSync: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createPaymentIntent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=integration.controller.d.ts.map