import { Request, Response } from "express";
import { inventoryService } from "./inventory.service";
import {
  createInventorySchema,
  inventoryIdSchema,
  updateInventorySchema,
} from "./inventory.validation";
import { partnerService } from "../partners/partner.service";
import { ApiError } from "../../utils/ApiError";

export const inventoryController = {
  create: async (req: Request, res: Response) => {
    const payload = createInventorySchema.parse(req.body);
    if (req.user?.role === "AGENT") {
      const partner = await partnerService.getById(payload.partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      if (partner.createdById !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
      if (partner.approvalStatus !== "APPROVED") {
        throw ApiError.forbidden("Partner must be approved before adding inventory");
      }
    }
    const item = await inventoryService.create(payload);
    return res.status(201).json(item);
  },

  list: async (req: Request, res: Response) => {
    const createdById = req.user?.role === "AGENT" ? req.user.id : undefined;
    const items = await inventoryService.list({ createdById });
    return res.status(200).json(items);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = inventoryIdSchema.parse(req.params);
    const item = await inventoryService.getById(id);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    if (req.user?.role === "AGENT" && item.partner.createdById !== req.user.id) {
      throw ApiError.forbidden("Insufficient permissions");
    }
    return res.status(200).json(item);
  },

  update: async (req: Request, res: Response) => {
    const { id } = inventoryIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      const current = await inventoryService.getById(id);
      if (!current) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      if (current.partner.createdById !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
    }
    const payload = updateInventorySchema.parse(req.body);
    const item = await inventoryService.update(id, payload);
    return res.status(200).json(item);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = inventoryIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      const current = await inventoryService.getById(id);
      if (!current) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      if (current.partner.createdById !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
    }
    await inventoryService.remove(id);
    return res.status(204).send();
  },
};
