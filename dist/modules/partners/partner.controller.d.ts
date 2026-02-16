import { Request, Response } from "express";
export declare const partnerController: {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    approve: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    reject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listEvents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=partner.controller.d.ts.map