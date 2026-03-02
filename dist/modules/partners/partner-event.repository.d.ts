import { PartnerEventType, Prisma } from "@prisma/client";
export declare const partnerEventRepository: {
    create: (data: {
        partnerId: string;
        type: PartnerEventType;
        actorId?: string;
        metadata?: Prisma.JsonValue;
    }) => Prisma.Prisma__PartnerEventClient<{
        id: string;
        partnerId: string;
        createdAt: Date;
        metadata: Prisma.JsonValue | null;
        type: import(".prisma/client").$Enums.PartnerEventType;
        actorId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
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
        partnerId: string;
        createdAt: Date;
        metadata: Prisma.JsonValue | null;
        type: import(".prisma/client").$Enums.PartnerEventType;
        actorId: string | null;
    }[]>;
    count: (params: {
        partnerId: string;
        type?: PartnerEventType;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Prisma.PrismaPromise<number>;
};
//# sourceMappingURL=partner-event.repository.d.ts.map