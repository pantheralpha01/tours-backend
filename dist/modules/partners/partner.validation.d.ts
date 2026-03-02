import { z } from "zod";
export declare const partnerServiceCategories: readonly ["GET_AROUND", "VERIFIED_STAYS", "LIVE_LIKE_LOCAL", "EXPERT_ACCESS", "GEAR_UP", "GET_ENTERTAINED"];
export declare const getAroundServices: readonly ["AIRPORT_TRANSFERS", "PRIVATE_DRIVERS", "CAR_RENTALS", "EV_CHARGING", "SCOOTER_BIKE_RENTALS", "TOURS", "CITY_TRANSFERS"];
export declare const verifiedStaysServices: readonly ["BOUTIQUE_HOTELS", "VETTED_RENTALS", "ECO_LODGES", "LUXURY_CAMPS"];
export declare const liveLikeLocalServices: readonly ["HOME_COOKED_MEALS", "NEIGHBORHOOD_WALKS", "LANGUAGE_EXCHANGE", "CULTURAL_LEARNING"];
export declare const expertAccessServices: readonly ["LAWYERS", "TOUR_GUIDES", "TRANSLATORS", "PHOTOGRAPHERS", "MEDICAL_ASSISTANTS", "SECURITY", "BUSINESS_SCOUTING", "INTERCONNECTIVITY_EXPERTS", "DELIVERY_SERVICES", "CLEANING_SERVICES", "EVENT_PLANNING"];
export declare const gearUpServices: readonly ["CAMPING_GEAR", "HIKING_EQUIPMENT", "TECH_RENTALS"];
export declare const getEntertainedServices: readonly ["CLUB", "DINE_OUT", "MASSAGE_SPA"];
export declare const partnerSignupSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    businessName: z.ZodString;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    description: z.ZodString;
    serviceCategories: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
    getAroundServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
    verifiedStaysServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
    liveLikeLocalServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
    expertAccessServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
    gearUpServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
    getEntertainedServices: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodString, "many">>, string[], string[] | undefined>, string[], string[] | undefined>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    description: string;
    businessName: string;
    serviceCategories: string[];
    getAroundServices: string[];
    verifiedStaysServices: string[];
    liveLikeLocalServices: string[];
    expertAccessServices: string[];
    gearUpServices: string[];
    getEntertainedServices: string[];
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    website?: string | undefined;
}, {
    email: string;
    password: string;
    description: string;
    businessName: string;
    serviceCategories: string[];
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    website?: string | undefined;
    getAroundServices?: string[] | undefined;
    verifiedStaysServices?: string[] | undefined;
    liveLikeLocalServices?: string[] | undefined;
    expertAccessServices?: string[] | undefined;
    gearUpServices?: string[] | undefined;
    getEntertainedServices?: string[] | undefined;
}>;
export declare const createPartnerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
}, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updatePartnerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    approvalStatus: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED"]>>;
    rejectedReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    rejectedReason?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    isActive?: boolean | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    rejectedReason?: string | undefined;
}>;
export declare const listPartnerSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    approvalStatus: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED"]>>;
    createdById: z.ZodOptional<z.ZodString>;
} & {
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    createdById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    createdById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const partnerIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const rejectPartnerSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export type PartnerSignup = z.infer<typeof partnerSignupSchema>;
export type CreatePartner = z.infer<typeof createPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;
export type ListPartner = z.infer<typeof listPartnerSchema>;
export type RejectPartner = z.infer<typeof rejectPartnerSchema>;
//# sourceMappingURL=partner.validation.d.ts.map