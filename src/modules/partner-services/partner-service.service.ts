import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../config/prisma";
import { partnerServiceRepository } from "./partner-service.repository";
import {
  CreatePartnerServiceInput,
  ListPartnerServicesQuery,
  UpdatePartnerServiceInput,
} from "./partner-service.validation";

/** Resolve the Partner record id from a User id (role: PARTNER) */
const resolvePartnerId = async (userId: string): Promise<string> => {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw ApiError.notFound("Partner profile not found for this user");
  if (partner.approvalStatus !== "APPROVED")
    throw ApiError.forbidden("Your partner account must be approved before adding services");
  return partner.id;
};

export const partnerServiceService = {
  // ── Partner actions ─────────────────────────────────────────────────────────

  createService: async (userId: string, data: CreatePartnerServiceInput) => {
    const partnerId = await resolvePartnerId(userId);
    return partnerServiceRepository.create(partnerId, data);
  },

  updateService: async (userId: string, serviceId: string, data: UpdatePartnerServiceInput) => {
    const partnerId = await resolvePartnerId(userId);
    const owns = await partnerServiceRepository.belongsToPartner(serviceId, partnerId);
    if (!owns) throw ApiError.notFound("Service not found or access denied");
    return partnerServiceRepository.update(serviceId, data);
  },

  deleteService: async (userId: string, serviceId: string) => {
    const partnerId = await resolvePartnerId(userId);
    const owns = await partnerServiceRepository.belongsToPartner(serviceId, partnerId);
    if (!owns) throw ApiError.notFound("Service not found or access denied");
    await partnerServiceRepository.delete(serviceId);
  },

  // ── Admin / Agent read actions ───────────────────────────────────────────────

  listServices: async (query: ListPartnerServicesQuery, onlyActive = true) => {
    const params = {
      skip: query.skip,
      take: query.take,
      serviceType: query.serviceType,
      serviceCategory: query.serviceCategory,
      city: query.city,
      selfDrive: query.selfDrive !== undefined ? query.selfDrive === "true" : undefined,
      partnerId: query.partnerId,
      search: query.search,
      onlyActive,
    };

    const [items, total] = await Promise.all([
      partnerServiceRepository.findMany(params),
      partnerServiceRepository.count(params),
    ]);

    return { items, total, skip: query.skip ?? 0, take: query.take ?? 20 };
  },

  getService: async (id: string) => {
    const svc = await partnerServiceRepository.findById(id);
    if (!svc) throw ApiError.notFound("Partner service not found");
    return svc;
  },

  // ── Admin override ───────────────────────────────────────────────────────────

  adminUpdateService: async (serviceId: string, data: UpdatePartnerServiceInput) => {
    await partnerServiceService.getService(serviceId); // ensure exists
    return partnerServiceRepository.update(serviceId, data);
  },
};
