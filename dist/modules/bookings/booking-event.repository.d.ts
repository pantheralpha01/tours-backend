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
        type: import(".prisma/client").$Enums.BookingEventType;
        actorId: string | null;
        metadata: Prisma.JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
};
//# sourceMappingURL=booking-event.repository.d.ts.map