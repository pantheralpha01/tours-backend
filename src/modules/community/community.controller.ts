import { CommunityPostStatus, CommunityReactionType, Role } from "@prisma/client";
import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { communityService } from "./community.service";
import {
  commentSchema,
  createPostSchema,
  createTopicSchema,
  feedQuerySchema,
  flagPostSchema,
  listPostsSchema,
  listTopicsSchema,
  moderatePostSchema,
  postIdParamSchema,
  reactionSchema,
  subscriptionSchema,
  subscriptionTargetOnlySchema,
  digestTriggerSchema,
  topicIdParamSchema,
  updatePostSchema,
  updateTopicSchema,
} from "./community.validation";

export const communityController = {
  createTopic: async (req: Request, res: Response) => {
    const payload = createTopicSchema.parse(req.body);
    const topic = await communityService.createTopic({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(topic);
  },

  listTopics: async (req: Request, res: Response) => {
    const params = listTopicsSchema.parse(req.query);
    const topics = await communityService.listTopics(params);
    return res.status(200).json(topics);
  },

  updateTopic: async (req: Request, res: Response) => {
    const { id } = topicIdParamSchema.parse(req.params);
    const payload = updateTopicSchema.parse(req.body);
    const topic = await communityService.updateTopic(id, payload);
    return res.status(200).json(topic);
  },

  createPost: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const payload = createPostSchema.parse(req.body);
    const privileged = req.user.role === "ADMIN" || req.user.role === "MANAGER";
    if (payload.isPinned && !privileged) {
      throw ApiError.forbidden("Only managers or admins can pin posts");
    }
    const post = await communityService.createPost({
      ...payload,
      authorId: req.user.id,
    });
    return res.status(201).json(post);
  },

  listPosts: async (req: Request, res: Response) => {
    const params = listPostsSchema.parse(req.query);
    const posts = await communityService.listPosts(params);
    return res.status(200).json(posts);
  },

  getFeed: async (req: Request, res: Response) => {
    const params = feedQuerySchema.parse(req.query);
    const feed = await communityService.getFeed(params, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    return res.status(200).json(feed);
  },

  getPost: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    const post = await communityService.getPost(id, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    return res.status(200).json(post);
  },

  updatePost: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    const payload = updatePostSchema.parse(req.body);
    const post = await communityService.updatePost(id, payload, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    return res.status(200).json(post);
  },

  deletePost: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    await communityService.deletePost(id, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    return res.status(204).send();
  },

  flagPost: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const { id } = postIdParamSchema.parse(req.params);
    const payload = flagPostSchema.parse(req.body);
    const post = await communityService.flagPost(id, {
      actorId: req.user.id,
      reason: payload.reason,
    });
    return res.status(200).json(post);
  },

  moderatePost: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    const payload = moderatePostSchema.parse(req.body);
    const post = await communityService.moderatePost(
      id,
      {
        status: payload.status as CommunityPostStatus,
        visibility: payload.visibility,
        isPinned: payload.isPinned,
        notes: payload.notes,
      },
      {
        id: req.user?.id,
        role: req.user?.role as Role | undefined,
      }
    );
    return res.status(200).json(post);
  },

  reactToPost: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const { id } = postIdParamSchema.parse(req.params);
    const payload = reactionSchema.parse(req.body);
    const result = await communityService.reactToPost(id, {
      userId: req.user.id,
      role: req.user.role as Role | undefined,
      type: payload.type as CommunityReactionType | undefined,
    });
    return res.status(200).json(result);
  },

  addComment: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const { id } = postIdParamSchema.parse(req.params);
    const payload = commentSchema.parse(req.body);
    const comment = await communityService.addComment(id, {
      userId: req.user.id,
      role: req.user.role as Role | undefined,
      content: payload.content,
      parentId: payload.parentId,
    });
    return res.status(201).json(comment);
  },

  listComments: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    await communityService.getPost(id, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    const comments = await communityService.listComments(id);
    return res.status(200).json(comments);
  },

  listSubscriptions: async (req: Request, res: Response) => {
    const subscriptions = await communityService.listSubscriptions({ id: req.user?.id });
    return res.status(200).json(subscriptions);
  },

  subscribe: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const payload = subscriptionSchema.parse(req.body);
    const subscription = await communityService.subscribe(payload, {
      id: req.user.id,
      role: req.user.role as Role | undefined,
    });
    return res.status(201).json(subscription);
  },

  unsubscribe: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw ApiError.unauthorized("Authentication required");
    }
    const payload = subscriptionTargetOnlySchema.parse(req.body);
    const result = await communityService.unsubscribe(payload, {
      id: req.user.id,
    });
    return res.status(200).json(result);
  },

  sendDigest: async (req: Request, res: Response) => {
    const payload = digestTriggerSchema.parse(req.body ?? {});
    const result = await communityService.sendDigest(payload, {
      id: req.user?.id,
      role: req.user?.role as Role | undefined,
    });
    return res.status(202).json(result);
  },
};
