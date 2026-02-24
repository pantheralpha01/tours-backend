import { Request, Response } from "express";

import { partnerInviteService } from "./partner-invite.service";
import {
  acceptPartnerInviteSchema,
  createPartnerInviteSchema,
  listPartnerInviteSchema,
} from "./partner-invite.validation";
import { ApiError } from "../../utils/ApiError";

export const partnerInviteController = {
  create: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized();
    }
    const payload = createPartnerInviteSchema.parse(req.body);
    const invite = await partnerInviteService.create({
      ...payload,
      invitedById: req.user.id,
    });
    return res.status(201).json(invite);
  },

  list: async (req: Request, res: Response) => {
    const params = listPartnerInviteSchema.parse(req.query);
    const invitedById = req.user?.role === "AGENT" ? req.user.id : params.invitedById;
    const result = await partnerInviteService.list({
      ...params,
      invitedById,
    });
    return res.status(200).json(result);
  },

  accept: async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
      throw ApiError.badRequest("Invite token is required");
    }
    const payload = acceptPartnerInviteSchema.parse(req.body);
    const invite = await partnerInviteService.accept(token, payload);
    return res.status(200).json({
      message: "Invite accepted",
      invite,
    });
  },
};
