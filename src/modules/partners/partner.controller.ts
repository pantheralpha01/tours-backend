import { Request, Response } from "express";
import { PartnerEventType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import {partnerService } from "./partner.service";
import { ApiError } from "../../utils/ApiError";
import {
  listPartnerSchema,
  partnerIdSchema,
  rejectPartnerSchema,
  updatePartnerSchema,
  partnerSignupSchema,
} from "./partner.validation";
import { partnerEventService } from "./partner-event.service";
import { paginationSchema } from "../../utils/pagination";

export const partnerController = {
  /**
   * Partner self-signup (public endpoint)
   */
  signup: async (req: Request, res: Response) => {
    const payload = partnerSignupSchema.parse(req.body);
    
    // Check if email already exists as a user
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw ApiError.conflict("Email already registered");
    }
    
    const result = await partnerService.signup(payload);
    return res.status(201).json({
      message: "Partner signup successful. Your application is pending admin approval.",
      data: result,
    });
  },

  create: async (req: Request, _res: Response) => {
    // For now, the primary way to create partners is through signup
    // This endpoint would be for admin-created partners only
    if (!req.user?.id) {
      throw ApiError.unauthorized();
    }

    throw ApiError.badRequest("Use /api/partners/signup endpoint for partner registration");
  },

  list: async (req: Request, res: Response) => {
    const params = listPartnerSchema.parse(req.query);
    const result = await partnerService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = partnerIdSchema.parse(req.params);
    const partner = await partnerService.getById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
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
    const allowedTypes = new Set<PartnerEventType>([
      "APPROVED",
      "REJECTED",
      "INVITED",
      "INVITE_ACCEPTED",
    ]);
    const type =
      typeof typeParam === "string" && allowedTypes.has(typeParam as PartnerEventType)
        ? (typeParam as PartnerEventType)
        : undefined;
    const partner = await partnerService.getById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
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
