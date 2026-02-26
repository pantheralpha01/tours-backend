export declare const offerAssetService: {
    generateLogo: () => Promise<{
        filepath: string;
        url: string;
        metadata: {
            type: "logo" | "signature";
            filename: string;
        };
    }>;
    generateSignature: () => Promise<{
        filepath: string;
        url: string;
        metadata: {
            type: "logo" | "signature";
            filename: string;
        };
    }>;
    persistAsset: (type: "logo" | "signature", buffer: Buffer, filename: string) => Promise<{
        filepath: string;
        url: string;
        metadata: {
            type: "logo" | "signature";
            filename: string;
        };
    }>;
};
//# sourceMappingURL=offer.assets.d.ts.map