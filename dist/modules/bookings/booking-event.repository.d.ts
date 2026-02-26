import { BookingEventType, Prisma } from "@prisma/client";
export declare const bookingEventRepository: {
    create: (data: {
        bookingId: string;
        type: BookingEventType;
        actorId?: string;
        metadata?: Prisma.JsonValue;
    }) => Prisma.Prisma__BookingEventClient<{
        id: string;
        createdAt: Date;
        bookingId: string;
        metadata: Prisma.JsonValue | null;
        type: import(".prisma/client").$Enums.BookingEventType;
        actorId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    listByBooking: (params: {
        bookingId: string;
        skip?: number;
        take?: number;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: "asc" | "desc";
    }) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        bookingId: string;
        metadata: Prisma.JsonValue | null;
        type: import(".prisma/client").$Enums.BookingEventType;
        actorId: string | null;
    }[]>;
    countByBooking: (params: {
        bookingId: string;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Prisma.PrismaPromise<number>;
};
//# sourceMappingURL=booking-event.repository.d.ts.map