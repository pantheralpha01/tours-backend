import { PartnerEventType, Prisma } from "@prisma/client";
export declare const partnerEventRepository: {
    create: (data: {
        partnerId: string;
        type: PartnerEventType;
        actorId?: string;
        metadata?: Prisma.JsonValue;
    }) => Prisma.Prisma__PartnerEventClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PartnerEventType;
        actorId: string | null;
        metadata: Prisma.JsonValue | null;
        partnerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMany: (params: {
        partnerId: string;
        type?: PartnerEventType;
        skip?: number;
        take?: number;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PartnerEventType;
        actorId: string | null;
        metadata: Prisma.JsonValue | null;
        partnerId: string;
    }[]>;
    count: (params: {
        partnerId: string;
        type?: PartnerEventType;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Prisma.PrismaPromise<number>;
};
//# sourceMappingURL=partner-event.repository.d.ts.map