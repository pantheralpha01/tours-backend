import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { offerController } from "./offer.controller";

export const offerRoutes = Router();

offerRoutes.use(authenticate);

offerRoutes.post(
  "/templates",
  requireRoles("ADMIN", "MANAGER"),
  offerController.createTemplate
);
offerRoutes.get(
  "/templates",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.listTemplates
);
offerRoutes.get(
  "/templates/:id",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.getTemplate
);

offerRoutes.post(
  "/calculate",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.calculatePrice
);

offerRoutes.post(
  "/proposals",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.createProposal
);
offerRoutes.get(
  "/proposals",
  requireRoles("ADMIN", "MANAGER"),
  offerController.listProposals
);
offerRoutes.get(
  "/proposals/:id",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.getProposal
);
offerRoutes.post(
  "/proposals/:id/assets",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.generateAssets
);
offerRoutes.post(
  "/proposals/:id/contract",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.generateContract
);
offerRoutes.post(
  "/proposals/:id/approve",
  requireRoles("ADMIN", "MANAGER"),
  offerController.approveProposal
);
offerRoutes.post(
  "/proposals/:id/publish",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  offerController.publishProposal
);
