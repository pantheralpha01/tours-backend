export declare const dispatchTrackRepository: {
    create: (data: {
        dispatchId: string;
        latitude: number;
        longitude: number;
        recordedAt?: Date;
        metadata?: Record<string, unknown>;
    }) => import(".prisma/client").Prisma.Prisma__DispatchTrackPointClient<{
        id: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        dispatchId: string;
        latitude: import("@prisma/client-runtime-utils").Decimal;
        longitude: import("@prisma/client-runtime-utils").Decimal;
        recordedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findMany: (params: {
        dispatchId: string;
        skip?: number;
        take?: number;
        dateFrom?: Date;
        dateTo?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        dispatchId: string;
        latitude: import("@prisma/client-runtime-utils").Decimal;
        longitude: import("@prisma/client-runtime-utils").Decimal;
        recordedAt: Date;
    }[]>;
    count: (params: {
        dispatchId: string;
        dateFrom?: Date;
        dateTo?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
};
//# sourceMappingURL=dispatch-track.repository.d.ts.map