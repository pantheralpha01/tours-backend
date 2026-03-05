"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPartnerServicesSchema = exports.updatePartnerServiceSchema = exports.createPartnerServiceSchema = void 0;
const zod_1 = require("zod");
exports.createPartnerServiceSchema = zod_1.z.object({
    serviceCategory: zod_1.z.enum([
        "GET_AROUND",
        "VERIFIED_STAYS",
        "LIVE_LIKE_LOCAL",
        "EXPERT_ACCESS",
        "GEAR_UP",
        "GET_ENTERTAINED",
    ]),
    serviceType: zod_1.z.enum([
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
    description: zod_1.z.string().min(1).max(500).optional(),
    // Car-specific
    carType: zod_1.z.string().max(100).optional(),
    selfDrive: zod_1.z.boolean().optional(),
    // Boat-specific
    boatCapacity: zod_1.z.number().int().positive().optional(),
    // Restaurant-specific
    cuisine: zod_1.z.string().max(100).optional(),
    // Cities where service is available
    cities: zod_1.z
        .array(zod_1.z.enum([
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
    ]))
        .min(1, "At least one city is required"),
    // Pricing
    priceFrom: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updatePartnerServiceSchema = exports.createPartnerServiceSchema.partial();
exports.listPartnerServicesSchema = zod_1.z.object({
    serviceType: zod_1.z
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
    serviceCategory: zod_1.z
        .enum([
        "GET_AROUND",
        "VERIFIED_STAYS",
        "LIVE_LIKE_LOCAL",
        "EXPERT_ACCESS",
        "GEAR_UP",
        "GET_ENTERTAINED",
    ])
        .optional(),
    city: zod_1.z
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
    selfDrive: zod_1.z.enum(["true", "false"]).optional(),
    partnerId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    skip: zod_1.z.coerce.number().int().min(0).optional(),
    take: zod_1.z.coerce.number().int().min(1).max(100).optional(),
});
//# sourceMappingURL=partner-service.validation.js.map