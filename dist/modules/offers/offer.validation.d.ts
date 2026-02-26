import { z } from "zod";
export declare const currencyEnum: z.ZodEnum<["USD", "KES"]>;
export declare const addonSchema: z.ZodObject<{
    label: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
    label: string;
}, {
    amount: number;
    label: string;
}>;
export declare const itineraryItemSchema: z.ZodObject<{
    day: z.ZodNumber;
    title: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    activities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    day: number;
    notes?: string | undefined;
    summary?: string | undefined;
    activities?: string[] | undefined;
}, {
    title: string;
    day: number;
    notes?: string | undefined;
    summary?: string | undefined;
    activities?: string[] | undefined;
}>;
export declare const templateSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    defaultCurrency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    baseAmount: z.ZodOptional<z.ZodNumber>;
    feePercentage: z.ZodOptional<z.ZodNumber>;
    itinerary: z.ZodOptional<z.ZodArray<z.ZodObject<{
        day: z.ZodNumber;
        title: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        activities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }, {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }>, "many">>;
    addons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        label: string;
    }, {
        amount: number;
        label: string;
    }>, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    defaultCurrency?: "USD" | "KES" | undefined;
    baseAmount?: number | undefined;
    feePercentage?: number | undefined;
    itinerary?: {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }[] | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    defaultCurrency?: "USD" | "KES" | undefined;
    baseAmount?: number | undefined;
    feePercentage?: number | undefined;
    itinerary?: {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }[] | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
}>;
export declare const priceCalculationSchema: z.ZodObject<{
    baseAmount: z.ZodNumber;
    addons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        label: string;
    }, {
        amount: number;
        label: string;
    }>, "many">>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    discountRateOverride: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    baseAmount: number;
    currency?: "USD" | "KES" | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
    discountRateOverride?: number | undefined;
}, {
    baseAmount: number;
    currency?: "USD" | "KES" | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
    discountRateOverride?: number | undefined;
}>;
export declare const proposalSchema: z.ZodObject<{
    baseAmount: z.ZodNumber;
    addons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        label: string;
    }, {
        amount: number;
        label: string;
    }>, "many">>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    discountRateOverride: z.ZodOptional<z.ZodNumber>;
} & {
    bookingId: z.ZodString;
    templateId: z.ZodOptional<z.ZodString>;
    itinerary: z.ZodOptional<z.ZodArray<z.ZodObject<{
        day: z.ZodNumber;
        title: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        activities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }, {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    baseAmount: number;
    currency?: "USD" | "KES" | undefined;
    expiresAt?: Date | undefined;
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    templateId?: string | undefined;
    itinerary?: {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }[] | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
    discountRateOverride?: number | undefined;
}, {
    bookingId: string;
    baseAmount: number;
    currency?: "USD" | "KES" | undefined;
    expiresAt?: Date | undefined;
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    templateId?: string | undefined;
    itinerary?: {
        title: string;
        day: number;
        notes?: string | undefined;
        summary?: string | undefined;
        activities?: string[] | undefined;
    }[] | undefined;
    addons?: {
        amount: number;
        label: string;
    }[] | undefined;
    discountRateOverride?: number | undefined;
}>;
export declare const listTemplatesSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}>;
export declare const listProposalsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
} & {
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "APPROVED", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"]>>;
    bookingId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "SENT" | "ACCEPTED" | "EXPIRED" | "APPROVED" | "DECLINED" | undefined;
    bookingId?: string | undefined;
    page?: number | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "SENT" | "ACCEPTED" | "EXPIRED" | "APPROVED" | "DECLINED" | undefined;
    bookingId?: string | undefined;
    page?: number | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const approveProposalSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
}, {
    notes?: string | undefined;
}>;
export declare const publishProposalSchema: z.ZodObject<{
    channel: z.ZodOptional<z.ZodEnum<["EMAIL", "SMS", "WHATSAPP", "LINK"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    channel?: "EMAIL" | "SMS" | "WHATSAPP" | "LINK" | undefined;
}, {
    notes?: string | undefined;
    channel?: "EMAIL" | "SMS" | "WHATSAPP" | "LINK" | undefined;
}>;
//# sourceMappingURL=offer.validation.d.ts.map