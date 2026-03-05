import { Request, Response, NextFunction } from "express";
import { partnerServiceService } from "./partner-service.service";
import {
  createPartnerServiceSchema,
  listPartnerServicesSchema,
  updatePartnerServiceSchema,
} from "./partner-service.validation";

export const partnerServiceController = {
  // POST /api/partner-services  (role: PARTNER)
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = createPartnerServiceSchema.parse(req.body);
      const service = await partnerServiceService.createService(req.user!.id, body);
      return res.status(201).json({ message: "Service listing created", data: service });
    } catch (err) {
      return next(err);
    }
  },

  // GET /api/partner-services  (role: AGENT, ADMIN, MANAGER, PARTNER)
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listPartnerServicesSchema.parse(req.query);
      const result = await partnerServiceService.listServices(query);
      return res.json({ data: result.items, meta: { total: result.total, skip: result.skip, take: result.take } });
    } catch (err) {
      return next(err);
    }
  },

  // GET /api/partner-services/:id
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await partnerServiceService.getService(req.params.id);
      return res.json({ data: service });
    } catch (err) {
      return next(err);
    }
  },

  // PATCH /api/partner-services/:id  (role: PARTNER — own only)
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = updatePartnerServiceSchema.parse(req.body);
      const service = await partnerServiceService.updateService(req.user!.id, req.params.id, body);
      return res.json({ message: "Service listing updated", data: service });
    } catch (err) {
      return next(err);
    }
  },

  // DELETE /api/partner-services/:id  (role: PARTNER — own only)
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await partnerServiceService.deleteService(req.user!.id, req.params.id);
      return res.json({ message: "Service listing deleted" });
    } catch (err) {
      return next(err);
    }
  },

  // PATCH /api/partner-services/:id/admin  (role: ADMIN)
  adminUpdate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = updatePartnerServiceSchema.parse(req.body);
      const service = await partnerServiceService.adminUpdateService(req.params.id, body);
      return res.json({ message: "Service listing updated by admin", data: service });
    } catch (err) {
      return next(err);
    }
  },
};
