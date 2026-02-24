import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { communityController } from "./community.controller";

export const communityRoutes = Router();

communityRoutes.use(authenticate);

communityRoutes.get("/topics", communityController.listTopics);
communityRoutes.post(
  "/topics",
  requireRoles("ADMIN", "MANAGER"),
  communityController.createTopic
);
communityRoutes.patch(
  "/topics/:id",
  requireRoles("ADMIN", "MANAGER"),
  communityController.updateTopic
);

communityRoutes.get("/feed", communityController.getFeed);
communityRoutes.get("/posts", communityController.listPosts);
communityRoutes.post(
  "/posts",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.createPost
);
communityRoutes.get("/posts/:id", communityController.getPost);
communityRoutes.patch(
  "/posts/:id",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.updatePost
);
communityRoutes.delete(
  "/posts/:id",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.deletePost
);
communityRoutes.post(
  "/posts/:id/react",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.reactToPost
);
communityRoutes.post(
  "/posts/:id/flag",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.flagPost
);
communityRoutes.post(
  "/posts/:id/moderate",
  requireRoles("ADMIN", "MANAGER"),
  communityController.moderatePost
);
communityRoutes.get("/posts/:id/comments", communityController.listComments);
communityRoutes.post(
  "/posts/:id/comments",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.addComment
);
communityRoutes.get(
  "/subscriptions",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.listSubscriptions
);
communityRoutes.post(
  "/subscriptions",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.subscribe
);
communityRoutes.delete(
  "/subscriptions",
  requireRoles("ADMIN", "MANAGER", "AGENT"),
  communityController.unsubscribe
);
communityRoutes.post(
  "/digest/send",
  requireRoles("ADMIN", "MANAGER"),
  communityController.sendDigest
);
