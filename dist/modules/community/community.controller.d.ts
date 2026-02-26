import { Request, Response } from "express";
export declare const communityController: {
    createTopic: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listTopics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateTopic: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getFeed: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    flagPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    moderatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    reactToPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    addComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listComments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listSubscriptions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    subscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    unsubscribe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    sendDigest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=community.controller.d.ts.map