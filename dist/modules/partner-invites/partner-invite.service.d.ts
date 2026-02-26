import { PartnerInviteStatus } from "@prisma/client";
import { PaginatedResponse } from "../../utils/pagination";
export declare const partnerInviteService: {
    create: (data: {
        companyName: string;
        email: string;
        invitedById: string;
        expiresInDays?: number;
        notes?: string;
    }) => Promise<{
        shareUrl: string;
        partner: {
            name: string;
            id: string;
            email: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
        } | null;
        invitedBy: {
            name: string;
            id: string;
            email: string;
        };
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }>;
    list: (params?: {
        page?: number;
        limit?: number;
        status?: PartnerInviteStatus;
        invitedById?: string;
        search?: string;
    }) => Promise<PaginatedResponse<any>>;
    accept: (token: string, payload: {
        contactName: string;
        phone?: string;
        companyName?: string;
        notes?: string;
    }) => Promise<{
        shareUrl: string;
        partner: {
            name: string;
            id: string;
            email: string | null;
            approvalStatus: import(".prisma/client").$Enums.PartnerApprovalStatus;
        } | null;
        invitedBy: {
            name: string;
            id: string;
            email: string;
        };
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }>;
};
//# sourceMappingURL=partner-invite.service.d.ts.map