import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { partnerInviteController } from "./partner-invite.controller";

export const partnerInviteRoutes = Router();
const partnerInvitePublicRoutes = Router();

partnerInviteRoutes.use(authenticate);
partnerInviteRoutes.use(requireRoles("ADMIN", "MANAGER"));

partnerInviteRoutes.post("/", partnerInviteController.create);
partnerInviteRoutes.get("/", partnerInviteController.list);

partnerInvitePublicRoutes.post("/:token/accept", partnerInviteController.accept);

export { partnerInvitePublicRoutes };
