import { Request, Response } from "express";
export declare const partnerController: {
    /**
     * Partner self-signup (public endpoint)
     */
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, _res: Response) => Promise<never>;
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    approve: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    reject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listEvents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=partner.controller.d.ts.map