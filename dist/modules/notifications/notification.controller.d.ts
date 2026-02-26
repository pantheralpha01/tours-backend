import { Request, Response } from "express";
export declare const notificationController: {
    createTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listTemplates: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    schedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listJobs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    sendNow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    triggerSos: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=notification.controller.d.ts.map