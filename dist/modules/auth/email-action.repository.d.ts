import { EmailActionType } from "@prisma/client";
export declare const emailActionRepository: {
    createToken: (data: {
        userId: string;
        tokenHash: string;
        type: EmailActionType;
        expiresAt: Date;
        metadata?: Record<string, unknown>;
    }) => any;
    invalidateExisting: (userId: string, type: EmailActionType) => any;
    findValidByHash: (tokenHash: string, type: EmailActionType) => any;
    markUsed: (id: string) => any;
};
//# sourceMappingURL=email-action.repository.d.ts.map