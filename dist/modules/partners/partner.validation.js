"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectPartnerSchema = exports.partnerIdSchema = exports.listPartnerSchema = exports.updatePartnerSchema = exports.createPartnerSchema = exports.partnerSignupSchema = exports.getEntertainedServices = exports.gearUpServices = exports.expertAccessServices = exports.liveLikeLocalServices = exports.verifiedStaysServices = exports.getAroundServices = exports.partnerServiceCategories = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
// Service category constants
exports.partnerServiceCategories = [
    "GET_AROUND",
    "VERIFIED_STAYS",
    "LIVE_LIKE_LOCAL",
    "EXPERT_ACCESS",
    "GEAR_UP",
    "GET_ENTERTAINED",
];
exports.getAroundServices = [
    "AIRPORT_TRANSFERS",
    "PRIVATE_DRIVERS",
    "CAR_RENTALS",
    "EV_CHARGING",
    "SCOOTER_BIKE_RENTALS",
    "TOURS",
    "CITY_TRANSFERS",
];
exports.verifiedStaysServices = [
    "BOUTIQUE_HOTELS",
    "VETTED_RENTALS",
    "ECO_LODGES",
    "LUXURY_CAMPS",
];
exports.liveLikeLocalServices = [
    "HOME_COOKED_MEALS",
    "NEIGHBORHOOD_WALKS",
    "LANGUAGE_EXCHANGE",
    "CULTURAL_LEARNING",
];
exports.expertAccessServices = [
    "LAWYERS",
    "TOUR_GUIDES",
    "TRANSLATORS",
    "PHOTOGRAPHERS",
    "MEDICAL_ASSISTANTS",
    "SECURITY",
    "BUSINESS_SCOUTING",
    "INTERCONNECTIVITY_EXPERTS",
    "DELIVERY_SERVICES",
    "CLEANING_SERVICES",
    "EVENT_PLANNING",
];
exports.gearUpServices = [
    "CAMPING_GEAR",
    "HIKING_EQUIPMENT",
    "TECH_RENTALS",
];
exports.getEntertainedServices = [
    "CLUB",
    "DINE_OUT",
    "MASSAGE_SPA",
];
// Partner signup schema (self-registration) - using string validation with refinement
exports.partnerSignupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, "First name must be at least 2 characters"),
    lastName: zod_1.z.string().min(2, "Last name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
    phone: zod_1.z.string().min(7, "Invalid phone number").optional(),
    businessName: zod_1.z.string().min(2, "Business name must be at least 2 characters"),
    website: zod_1.z.string().url("Invalid website URL").optional().or(zod_1.z.literal("")),
    description: zod_1.z.string().max(1000, "Description too long"),
    // Services selection - validate as arrays of strings
    serviceCategories: zod_1.z
        .array(zod_1.z.string())
        .min(1, "Select at least one service category")
        .refine((arr) => arr.every((val) => exports.partnerServiceCategories.includes(val)), "Invalid service category"),
    getAroundServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.getAroundServices.includes(val)), "Invalid get around service"),
    verifiedStaysServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.verifiedStaysServices.includes(val)), "Invalid verified stays service"),
    liveLikeLocalServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.liveLikeLocalServices.includes(val)), "Invalid live like local service"),
    expertAccessServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.expertAccessServices.includes(val)), "Invalid expert access service"),
    gearUpServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.gearUpServices.includes(val)), "Invalid gear up service"),
    getEntertainedServices: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .transform((arr) => arr ?? [])
        .refine((arr) => arr.every((val) => exports.getEntertainedServices.includes(val)), "Invalid get entertained service"),
});
// Legacy schemas (kept for backward compatibility with admin invitation flow)
exports.createPartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(7).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updatePartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(7).optional(),
    isActive: zod_1.z.boolean().optional(),
    approvalStatus: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    rejectedReason: zod_1.z.string().min(3).optional(),
});
exports.listPartnerSchema = pagination_1.paginationSchema
    .merge(zod_1.z.object({
    approvalStatus: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    createdById: zod_1.z.string().uuid().optional(),
}))
    .extend({
    search: zod_1.z.string().optional(),
});
exports.partnerIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.rejectPartnerSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).optional(),
});
//# sourceMappingURL=partner.validation.js.map