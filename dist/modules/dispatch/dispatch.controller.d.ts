import { Request, Response } from "express";
export declare const dispatchController: {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    remove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    addTrackPoint: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listTrackPoints: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    timeline: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=dispatch.controller.d.ts.map