/**
 * Booking Mapper
 * Transforms DTOs to Prisma models and handles all type conversions
 */
import { Prisma } from "@prisma/client";
import { CreateBookingDTO, UpdateBookingDTO } from "./booking.dto";
/**
 * Map CreateBookingDTO to Prisma create input
 * Handles type conversions, commission calculations, and JSON serialization
 */
export declare const mapCreateDTOToDb: (dto: CreateBookingDTO & {
    agentId: string;
}) => any;
/**
 * Map UpdateBookingDTO to Prisma update input
 * Only updates provided fields
 */
export declare const mapUpdateDTOToDb: (dto: UpdateBookingDTO) => Prisma.BookingUpdateInput;
//# sourceMappingURL=booking.mapper.d.ts.map