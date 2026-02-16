import { DispatchEventType, Prisma } from "@prisma/client";
export declare const dispatchEventRepository: {
    create: (data: {
        dispatchId: string;
        type: DispatchEventType;
        actorId?: string;
        metadata?: Prisma.JsonValue;
    }) => Prisma.Prisma__DispatchEventClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.DispatchEventType;
        actorId: string | null;
        metadata: Prisma.JsonValue | null;
        dispatchId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMany: (params: {
        dispatchId: string;
        dateFrom?: Date;
        dateTo?: Date;
        take?: number;
    }) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.DispatchEventType;
        actorId: string | null;
        metadata: Prisma.JsonValue | null;
        dispatchId: string;
    }[]>;
};
//# sourceMappingURL=dispatch-event.repository.d.ts.map