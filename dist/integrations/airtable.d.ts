export declare const airtableService: {
    syncProviders: (action: "pull" | "push", table?: string) => Promise<{
        action: "push" | "pull";
        table: string;
        status: string;
    }>;
};
//# sourceMappingURL=airtable.d.ts.map