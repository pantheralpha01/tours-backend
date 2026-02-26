export declare const offerContractService: {
    generate: (data: {
        bookingId: string;
        customerName: string;
        serviceTitle: string;
        itinerary?: Array<Record<string, unknown>>;
        priceBreakdown?: Record<string, unknown>;
        notes?: string | null;
        logoUrl?: string | null;
        signatureUrl?: string | null;
    }) => Promise<{
        filepath: string;
        url: string;
        metadata: {
            filename: string;
        };
    }>;
};
//# sourceMappingURL=offer.contract.d.ts.map