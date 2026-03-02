import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const ensureString = (val: unknown) => {
  if (typeof val === "number") {
    return val.toString();
  }
  return val;
};

const coerceString = (schema?: z.ZodString) =>
  z.preprocess(ensureString, schema ?? z.string());

const stringArray = () =>
  z.array(coerceString());

// Service category constants
export const partnerServiceCategories = [
  "GET_AROUND",
  "VERIFIED_STAYS",
  "LIVE_LIKE_LOCAL",
  "EXPERT_ACCESS",
  "GEAR_UP",
  "GET_ENTERTAINED",
] as const;

export const getAroundServices = [
  "AIRPORT_TRANSFERS",
  "PRIVATE_DRIVERS",
  "CAR_RENTALS",
  "EV_CHARGING",
  "SCOOTER_BIKE_RENTALS",
  "TOURS",
  "CITY_TRANSFERS",
] as const;

export const verifiedStaysServices = [
  "BOUTIQUE_HOTELS",
  "VETTED_RENTALS",
  "ECO_LODGES",
  "LUXURY_CAMPS",
] as const;

export const liveLikeLocalServices = [
  "HOME_COOKED_MEALS",
  "NEIGHBORHOOD_WALKS",
  "LANGUAGE_EXCHANGE",
  "CULTURAL_LEARNING",
] as const;

export const expertAccessServices = [
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
] as const;

export const gearUpServices = [
  "CAMPING_GEAR",
  "HIKING_EQUIPMENT",
  "TECH_RENTALS",
] as const;

export const getEntertainedServices = [
  "CLUB",
  "DINE_OUT",
  "MASSAGE_SPA",
] as const;

// Partner signup schema (self-registration) - using string validation with refinement
export const partnerSignupSchema = z.object({
  firstName: coerceString(z.string().min(2, "First name must be at least 2 characters")),
  lastName: coerceString(z.string().min(2, "Last name must be at least 2 characters")),
  email: coerceString(z.string().email("Invalid email address")),
  password: coerceString(
    z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
  ),
  phone: coerceString(z.string().min(7, "Invalid phone number")).optional(),
  businessName: coerceString(z.string().min(2, "Business name must be at least 2 characters")),
  website: coerceString(z.string().url("Invalid website URL")).optional().or(z.literal("")),
  description: coerceString(z.string().max(1000, "Description too long")),
  
  // Services selection - validate as arrays of strings
  serviceCategories: stringArray()
    .min(1, "Select at least one service category")
    .refine(
      (arr) => arr.every((val) => partnerServiceCategories.includes(val as any)),
      "Invalid service category"
    ),

  getAroundServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => getAroundServices.includes(val as any)),
      "Invalid get around service"
    ),

  verifiedStaysServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => verifiedStaysServices.includes(val as any)),
      "Invalid verified stays service"
    ),

  liveLikeLocalServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => liveLikeLocalServices.includes(val as any)),
      "Invalid live like local service"
    ),

  expertAccessServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => expertAccessServices.includes(val as any)),
      "Invalid expert access service"
    ),

  gearUpServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => gearUpServices.includes(val as any)),
      "Invalid gear up service"
    ),

  getEntertainedServices: stringArray()
    .optional()
    .transform((arr) => arr ?? [])
    .refine(
      (arr) => arr.every((val) => getEntertainedServices.includes(val as any)),
      "Invalid get entertained service"
    ),
});

// Legacy schemas (kept for backward compatibility with admin invitation flow)
export const createPartnerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  isActive: z.boolean().optional(),
});

export const updatePartnerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  isActive: z.boolean().optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  rejectedReason: z.string().min(3).optional(),
});

export const listPartnerSchema = paginationSchema
  .merge(
    z.object({
      approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
      createdById: z.string().uuid().optional(),
    })
  )
  .extend({
    search: z.string().optional(),
  });

export const partnerIdSchema = z.object({
  id: z.string().uuid(),
});

export const rejectPartnerSchema = z.object({
  reason: z.string().min(3).optional(),
});

// Type exports
export type PartnerSignup = z.infer<typeof partnerSignupSchema>;
export type CreatePartner = z.infer<typeof createPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;
export type ListPartner = z.infer<typeof listPartnerSchema>;
export type RejectPartner = z.infer<typeof rejectPartnerSchema>;
