import { Request, Response } from "express";

import { partnerInviteService } from "./partner-invite.service";

export const partnerInviteController = {
  create: async (_req: Request, res: Response) => {
    const invite = await partnerInviteService.create();
    return res.status(201).json(invite);
  },

  list: async (_req: Request, res: Response) => {
    const result = await partnerInviteService.list();
    return res.status(200).json(result);
  },

  accept: async (_req: Request, res: Response) => {
    const invite = await partnerInviteService.accept();
    return res.status(200).json({
      message: "Invite accepted",
      invite,
    });
  },
};
