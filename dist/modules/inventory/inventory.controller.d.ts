import { Request, Response } from "express";
export declare const inventoryController: {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=inventory.controller.d.ts.map