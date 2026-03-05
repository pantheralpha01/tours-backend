import { z } from "zod";

export const createPartnerServiceSchema = z.object({
  serviceCategory: z.enum([
    "GET_AROUND",
    "VERIFIED_STAYS",
    "LIVE_LIKE_LOCAL",
    "EXPERT_ACCESS",
    "GEAR_UP",
    "GET_ENTERTAINED",
  ]),
  serviceType: z.enum([
    "CAR",
    "DRIVER",
    "GUIDE",
    "PARK",
    "MOTO",
    "BOAT",
    "MASSAGE",
    "RESTAURANT",
    "SHOP",
    "LAUNDRY",
  ]),
  description: z.string().min(1).max(500).optional(),

  // Car-specific
  carType: z.string().max(100).optional(),
  selfDrive: z.boolean().optional(),

  // Boat-specific
  boatCapacity: z.number().int().positive().optional(),

  // Restaurant-specific
  cuisine: z.string().max(100).optional(),

  // Cities where service is available
  cities: z
    .array(
      z.enum([
        "NAIROBI",
        "MOMBASA",
        "DIANI_BEACH",
        "MALINDI",
        "KISUMU",
        "NAKURU",
        "ELDORET",
        "LAMU",
        "NANYUKI",
        "AMBOSELI",
        "WATAMU",
        "ZANZIBAR",
        "ARUSHA",
        "DAR_ES_SALAAM",
      ])
    )
    .min(1, "At least one city is required"),

  // Pricing
  priceFrom: z.number().positive().optional(),
  currency: z.enum(["USD", "KES"]).optional(),

  isActive: z.boolean().optional(),
});

export const updatePartnerServiceSchema = createPartnerServiceSchema.partial();

export const listPartnerServicesSchema = z.object({
  serviceType: z
    .enum([
      "CAR",
      "DRIVER",
      "GUIDE",
      "PARK",
      "MOTO",
      "BOAT",
      "MASSAGE",
      "RESTAURANT",
      "SHOP",
      "LAUNDRY",
    ])
    .optional(),
  serviceCategory: z
    .enum([
      "GET_AROUND",
      "VERIFIED_STAYS",
      "LIVE_LIKE_LOCAL",
      "EXPERT_ACCESS",
      "GEAR_UP",
      "GET_ENTERTAINED",
    ])
    .optional(),
  city: z
    .enum([
      "NAIROBI",
      "MOMBASA",
      "DIANI_BEACH",
      "MALINDI",
      "KISUMU",
      "NAKURU",
      "ELDORET",
      "LAMU",
      "NANYUKI",
      "AMBOSELI",
      "WATAMU",
      "ZANZIBAR",
      "ARUSHA",
      "DAR_ES_SALAAM",
    ])
    .optional(),
  selfDrive: z.enum(["true", "false"]).optional(),
  partnerId: z.string().uuid().optional(),
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreatePartnerServiceInput = z.infer<typeof createPartnerServiceSchema>;
export type UpdatePartnerServiceInput = z.infer<typeof updatePartnerServiceSchema>;
export type ListPartnerServicesQuery = z.infer<typeof listPartnerServicesSchema>;
