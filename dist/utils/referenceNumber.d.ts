/**
 * Generates the next booking reference number atomically.
 * Format: TF-YYYYMM-XXXXX  (e.g. TF-202603-00042)
 *
 * Uses an upsert + update in a transaction so concurrent requests
 * never produce duplicate reference numbers.
 *
 * Returns: { referenceNumber: "TF-202603-00042", referenceSeq: 42 }
 */
export declare function generateBookingReference(date?: Date): Promise<{
    referenceNumber: string;
    referenceSeq: number;
}>;
//# sourceMappingURL=referenceNumber.d.ts.map