import { Request, Response } from "express";
import { partnerService } from "./partner.service";
import {
  createPartnerSchema,
  listPartnerSchema,
  partnerIdSchema,
  rejectPartnerSchema,
  updatePartnerSchema,
} from "./partner.validation";
import { ApiError } from "../../utils/ApiError";
import { partnerEventService } from "./partner-event.service";
import { paginationSchema } from "../../utils/pagination";

export const partnerController = {
  create: async (req: Request, res: Response) => {
    const payload = createPartnerSchema.parse(req.body);
    const partner = await partnerService.create({
      ...payload,
      createdById: req.user?.id,
    });
    return res.status(201).json(partner);
  },

  list: async (req: Request, res: Response) => {
    const params = listPartnerSchema.parse(req.query);
    const createdById =
      req.user?.role === "AGENT" ? req.user.id : params.createdById;
    const result = await partnerService.list({
      ...params,
      createdById,
    });
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const partner = await partnerService.getById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    if (req.user?.role === "AGENT" && partner.createdById !== req.user.id) {
      throw ApiError.forbidden("Insufficient permissions");
    }
    return res.status(200).json(partner);
  },

  update: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const payload = updatePartnerSchema.parse(req.body);
    const partner = await partnerService.update(id, payload);
    return res.status(200).json(partner);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    await partnerService.remove(id);
    return res.status(204).send();
  },

  approve: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const actorId = req.user?.id;
    if (!actorId) {
      throw ApiError.unauthorized();
    }
    const partner = await partnerService.approve(id, actorId);
    return res.status(200).json(partner);
  },

  reject: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const payload = rejectPartnerSchema.parse(req.body);
    const actorId = req.user?.id;
    if (!actorId) {
      throw ApiError.unauthorized();
    }
    const partner = await partnerService.reject(id, actorId, payload.reason);
    return res.status(200).json(partner);
  },

  listEvents: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const params = paginationSchema.parse(req.query);
    const typeParam = req.query.type;
    const type =
      typeof typeParam === "string" &&
      (typeParam === "APPROVED" || typeParam === "REJECTED")
        ? typeParam
        : undefined;
    const partner = await partnerService.getById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    if (req.user?.role === "AGENT" && partner.createdById !== req.user.id) {
      throw ApiError.forbidden("Insufficient permissions");
    }
    const result = await partnerEventService.list({
      partnerId: id,
      page: params.page,
      limit: params.limit,
      type,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sort: params.sort,
    });
    return res.status(200).json(result);
  },
};
