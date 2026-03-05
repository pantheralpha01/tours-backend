import { z } from "zod";
export declare const createPartnerServiceSchema: z.ZodObject<{
    serviceCategory: z.ZodEnum<["GET_AROUND", "VERIFIED_STAYS", "LIVE_LIKE_LOCAL", "EXPERT_ACCESS", "GEAR_UP", "GET_ENTERTAINED"]>;
    serviceType: z.ZodEnum<["CAR", "DRIVER", "GUIDE", "PARK", "MOTO", "BOAT", "MASSAGE", "RESTAURANT", "SHOP", "LAUNDRY"]>;
    description: z.ZodOptional<z.ZodString>;
    carType: z.ZodOptional<z.ZodString>;
    selfDrive: z.ZodOptional<z.ZodBoolean>;
    boatCapacity: z.ZodOptional<z.ZodNumber>;
    cuisine: z.ZodOptional<z.ZodString>;
    cities: z.ZodArray<z.ZodEnum<["NAIROBI", "MOMBASA", "DIANI_BEACH", "MALINDI", "KISUMU", "NAKURU", "ELDORET", "LAMU", "NANYUKI", "AMBOSELI", "WATAMU", "ZANZIBAR", "ARUSHA", "DAR_ES_SALAAM"]>, "many">;
    priceFrom: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    serviceCategory: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED";
    serviceType: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY";
    cities: ("NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM")[];
    isActive?: boolean | undefined;
    currency?: "USD" | "KES" | undefined;
    description?: string | undefined;
    carType?: string | undefined;
    selfDrive?: boolean | undefined;
    boatCapacity?: number | undefined;
    cuisine?: string | undefined;
    priceFrom?: number | undefined;
}, {
    serviceCategory: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED";
    serviceType: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY";
    cities: ("NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM")[];
    isActive?: boolean | undefined;
    currency?: "USD" | "KES" | undefined;
    description?: string | undefined;
    carType?: string | undefined;
    selfDrive?: boolean | undefined;
    boatCapacity?: number | undefined;
    cuisine?: string | undefined;
    priceFrom?: number | undefined;
}>;
export declare const updatePartnerServiceSchema: z.ZodObject<{
    serviceCategory: z.ZodOptional<z.ZodEnum<["GET_AROUND", "VERIFIED_STAYS", "LIVE_LIKE_LOCAL", "EXPERT_ACCESS", "GEAR_UP", "GET_ENTERTAINED"]>>;
    serviceType: z.ZodOptional<z.ZodEnum<["CAR", "DRIVER", "GUIDE", "PARK", "MOTO", "BOAT", "MASSAGE", "RESTAURANT", "SHOP", "LAUNDRY"]>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    carType: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    selfDrive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    boatCapacity: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    cuisine: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cities: z.ZodOptional<z.ZodArray<z.ZodEnum<["NAIROBI", "MOMBASA", "DIANI_BEACH", "MALINDI", "KISUMU", "NAKURU", "ELDORET", "LAMU", "NANYUKI", "AMBOSELI", "WATAMU", "ZANZIBAR", "ARUSHA", "DAR_ES_SALAAM"]>, "many">>;
    priceFrom: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    currency: z.ZodOptional<z.ZodOptional<z.ZodEnum<["USD", "KES"]>>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    currency?: "USD" | "KES" | undefined;
    description?: string | undefined;
    serviceCategory?: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED" | undefined;
    serviceType?: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY" | undefined;
    carType?: string | undefined;
    selfDrive?: boolean | undefined;
    boatCapacity?: number | undefined;
    cuisine?: string | undefined;
    priceFrom?: number | undefined;
    cities?: ("NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM")[] | undefined;
}, {
    isActive?: boolean | undefined;
    currency?: "USD" | "KES" | undefined;
    description?: string | undefined;
    serviceCategory?: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED" | undefined;
    serviceType?: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY" | undefined;
    carType?: string | undefined;
    selfDrive?: boolean | undefined;
    boatCapacity?: number | undefined;
    cuisine?: string | undefined;
    priceFrom?: number | undefined;
    cities?: ("NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM")[] | undefined;
}>;
export declare const listPartnerServicesSchema: z.ZodObject<{
    serviceType: z.ZodOptional<z.ZodEnum<["CAR", "DRIVER", "GUIDE", "PARK", "MOTO", "BOAT", "MASSAGE", "RESTAURANT", "SHOP", "LAUNDRY"]>>;
    serviceCategory: z.ZodOptional<z.ZodEnum<["GET_AROUND", "VERIFIED_STAYS", "LIVE_LIKE_LOCAL", "EXPERT_ACCESS", "GEAR_UP", "GET_ENTERTAINED"]>>;
    city: z.ZodOptional<z.ZodEnum<["NAIROBI", "MOMBASA", "DIANI_BEACH", "MALINDI", "KISUMU", "NAKURU", "ELDORET", "LAMU", "NANYUKI", "AMBOSELI", "WATAMU", "ZANZIBAR", "ARUSHA", "DAR_ES_SALAAM"]>>;
    selfDrive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    partnerId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    skip?: number | undefined;
    search?: string | undefined;
    take?: number | undefined;
    partnerId?: string | undefined;
    serviceCategory?: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED" | undefined;
    serviceType?: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY" | undefined;
    selfDrive?: "true" | "false" | undefined;
    city?: "NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM" | undefined;
}, {
    skip?: number | undefined;
    search?: string | undefined;
    take?: number | undefined;
    partnerId?: string | undefined;
    serviceCategory?: "GET_AROUND" | "VERIFIED_STAYS" | "LIVE_LIKE_LOCAL" | "EXPERT_ACCESS" | "GEAR_UP" | "GET_ENTERTAINED" | undefined;
    serviceType?: "CAR" | "DRIVER" | "GUIDE" | "PARK" | "MOTO" | "BOAT" | "MASSAGE" | "RESTAURANT" | "SHOP" | "LAUNDRY" | undefined;
    selfDrive?: "true" | "false" | undefined;
    city?: "NAIROBI" | "MOMBASA" | "DIANI_BEACH" | "MALINDI" | "KISUMU" | "NAKURU" | "ELDORET" | "LAMU" | "NANYUKI" | "AMBOSELI" | "WATAMU" | "ZANZIBAR" | "ARUSHA" | "DAR_ES_SALAAM" | undefined;
}>;
export type CreatePartnerServiceInput = z.infer<typeof createPartnerServiceSchema>;
export type UpdatePartnerServiceInput = z.infer<typeof updatePartnerServiceSchema>;
export type ListPartnerServicesQuery = z.infer<typeof listPartnerServicesSchema>;
//# sourceMappingURL=partner-service.validation.d.ts.map