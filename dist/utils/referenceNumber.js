"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingReference = generateBookingReference;
const prisma_1 = require("../config/prisma");
const PREFIX = "TF";
const SEQ_PADDING = 5; // TF-202603-00042
/**
 * Generates the next booking reference number atomically.
 * Format: TF-YYYYMM-XXXXX  (e.g. TF-202603-00042)
 *
 * Uses an upsert + update in a transaction so concurrent requests
 * never produce duplicate reference numbers.
 *
 * Returns: { referenceNumber: "TF-202603-00042", referenceSeq: 42 }
 */
async function generateBookingReference(date = new Date()) {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        // Ensure the row exists, then atomically increment
        await tx.bookingSequence.upsert({
            where: { id: monthKey },
            create: { id: monthKey, lastSeq: 0 },
            update: {},
        });
        const updated = await tx.bookingSequence.update({
            where: { id: monthKey },
            data: { lastSeq: { increment: 1 } },
        });
        return updated.lastSeq;
    });
    const referenceNumber = `${PREFIX}-${monthLabel}-${String(result).padStart(SEQ_PADDING, "0")}`;
    return { referenceNumber, referenceSeq: result };
}
//# sourceMappingURL=referenceNumber.js.map