import { PartnerInviteStatus, Prisma } from "@prisma/client";
declare const inviteInclude: {
    partner: {
        select: {
            id: true;
            name: true;
            approvalStatus: true;
            email: true;
        };
    };
    invitedBy: {
        select: {
            id: true;
            name: true;
            email: true;
        };
    };
};
export type PartnerInviteWithRelations = Prisma.PartnerInviteGetPayload<{
    include: typeof inviteInclude;
}>;
export declare const partnerInviteRepository: {
    create: (data: Prisma.PartnerInviteCreateInput) => Prisma.Prisma__PartnerInviteClient<{
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
    } & {
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: Prisma.JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findMany: (params?: {
        skip?: number;
        take?: number;
        status?: PartnerInviteStatus;
        invitedById?: string;
        search?: string;
    }) => Prisma.PrismaPromise<({
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
    } & {
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: Prisma.JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    })[]>;
    count: (params?: {
        status?: PartnerInviteStatus;
        invitedById?: string;
        search?: string;
    }) => Prisma.PrismaPromise<number>;
    findByToken: (token: string) => Prisma.Prisma__PartnerInviteClient<({
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
    } & {
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: Prisma.JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findActiveByEmail: (email: string) => Prisma.Prisma__PartnerInviteClient<({
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
    } & {
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: Prisma.JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update: (id: string, data: Prisma.PartnerInviteUpdateInput) => Prisma.Prisma__PartnerInviteClient<{
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
    } & {
        id: string;
        email: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PartnerInviteStatus;
        expiresAt: Date;
        notes: string | null;
        companyName: string;
        token: string;
        metadata: Prisma.JsonValue | null;
        partnerId: string | null;
        invitedById: string;
        acceptedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
};
export {};
//# sourceMappingURL=partner-invite.repository.d.ts.map