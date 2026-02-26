import { Request, Response } from "express";
export declare const offerController: {
    createTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listTemplates: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    calculatePrice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listProposals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    generateAssets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    generateContract: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    approveProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    publishProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=offer.controller.d.ts.map