import { Request, Response, NextFunction } from "express";
export declare const partnerServiceController: {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getOne: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    adminUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
//# sourceMappingURL=partner-service.controller.d.ts.map