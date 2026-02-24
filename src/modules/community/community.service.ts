import {
  CommunityPostStatus,
  CommunityReactionType,
  CommunitySubscriptionFrequency,
  Prisma,
  Role,
} from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { communityRepository } from "./community.repository";
import { prisma } from "../../config/prisma";
import { communityNotificationService } from "./community.notification.service";

const randomSuffix = () => Math.random().toString(36).slice(2, 8);

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureSlugSeed = (value: string, prefix: string) => {
  const normalized = normalizeSlug(value);
  return normalized || `${prefix}-${randomSuffix()}`;
};

const buildExcerpt = (content: string, existing?: string | null) =>
  existing ?? content.substring(0, 240).trim();

const ensureUniquePostSlug = async (incoming: string) => {
  let slug = incoming;
  let counter = 1;
  while (await communityRepository.findPostBySlug(slug)) {
    slug = `${incoming}-${counter++}`;
  }
  return slug;
};

const ensureUniqueTopicSlug = async (incoming: string) => {
  let slug = incoming;
  let counter = 1;
  while (await communityRepository.findTopicBySlug(slug)) {
    slug = `${incoming}-${counter++}`;
  }
  return slug;
};

const isPrivileged = (role?: Role | null) => role === "ADMIN" || role === "MANAGER";

const assertAuthorOrPrivileged = (params: {
  actorId?: string;
  actorRole?: Role | null;
  authorId: string;
}) => {
  if (!params.actorId) {
    throw ApiError.forbidden("Authentication required");
  }
  if (params.actorId !== params.authorId && !isPrivileged(params.actorRole)) {
    throw ApiError.forbidden("You cannot modify this post");
  }
};

const sanitizeTags = (tags?: string[]) => (tags ? Array.from(new Set(tags)) : undefined);

const metadataToObject = (value?: Prisma.JsonValue | null): Record<string, any> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return { ...(value as Record<string, unknown>) };
};

const appendModerationNote = (metadata: Record<string, any>, entry: { actorId?: string; notes?: string }) => {
  if (!entry.notes) {
    return metadata;
  }
  const history = Array.isArray(metadata.moderationNotes) ? metadata.moderationNotes : [];
  history.push({
    notes: entry.notes,
    actorId: entry.actorId,
    recordedAt: new Date().toISOString(),
  });
  metadata.moderationNotes = history;
  return metadata;
};

const requireAuthenticatedUser = (actorId?: string) => {
  if (!actorId) {
    throw ApiError.unauthorized("Authentication required");
  }
  return actorId;
};

const resolveSubscriptionTarget = (data: { topicId?: string; postId?: string }) => {
  const hasTopic = Boolean(data.topicId);
  const hasPost = Boolean(data.postId);

  if ((hasTopic && hasPost) || (!hasTopic && !hasPost)) {
    throw ApiError.badRequest("Provide either topicId or postId");
  }

  return {
    topicId: data.topicId ?? null,
    postId: data.postId ?? null,
  };
};

export const communityService = {
  createTopic: async (
    data: {
      name: string;
      slug?: string;
      description?: string;
      icon?: string;
      color?: string;
      metadata?: Record<string, unknown>;
      actorId?: string;
    }
  ) => {
    const slugBase = ensureSlugSeed(data.slug ?? data.name, "topic");
    const slug = await ensureUniqueTopicSlug(slugBase);

    return communityRepository.createTopic({
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
    });
  },

  listTopics: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      communityRepository.listTopics({ skip, take: limit, search: params?.search }),
      communityRepository.countTopics({ search: params?.search }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  updateTopic: async (
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      icon?: string;
      color?: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    const existing = await communityRepository.findTopicById(id);
    if (!existing) {
      throw ApiError.notFound("Topic not found");
    }

    const slugInput = data.slug
      ? ensureSlugSeed(data.slug, "topic")
      : data.name
      ? ensureSlugSeed(data.name, "topic")
      : existing.slug;
    const slug = slugInput === existing.slug ? existing.slug : await ensureUniqueTopicSlug(slugInput);

    return communityRepository.updateTopic(id, {
      name: data.name ?? existing.name,
      slug,
      description: data.description ?? existing.description ?? null,
      icon: data.icon ?? existing.icon ?? null,
      color: data.color ?? existing.color ?? null,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
    });
  },

  createPost: async (
    data: {
      title: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
      topicId?: string;
      status?: CommunityPostStatus;
      visibility?: "PUBLIC" | "MEMBERS_ONLY";
      isPinned?: boolean;
      authorId: string;
    }
  ) => {
    const baseSlug = ensureSlugSeed(data.title, "post");
    const slug = await ensureUniquePostSlug(baseSlug);
    const status = data.status ?? CommunityPostStatus.DRAFT;

    const post = await communityRepository.createPost({
      title: data.title,
      slug,
      content: data.content,
      excerpt: buildExcerpt(data.content, data.excerpt),
      coverImage: data.coverImage,
      tags: data.tags ? (sanitizeTags(data.tags) as Prisma.InputJsonValue) : undefined,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      status,
      visibility: data.visibility ?? "PUBLIC",
      isPinned: data.isPinned ?? false,
      pinnedAt: data.isPinned ? new Date() : undefined,
      publishedAt: status === CommunityPostStatus.PUBLISHED ? new Date() : undefined,
      lastActivityAt: new Date(),
      author: { connect: { id: data.authorId } },
      topic: data.topicId ? { connect: { id: data.topicId } } : undefined,
    });

    if (post.status === CommunityPostStatus.PUBLISHED) {
      await communityNotificationService.notifyPostPublished(post);
    }

    return post;
  },

  listPosts: async (params?: {
    page?: number;
    limit?: number;
    status?: CommunityPostStatus;
    visibility?: "PUBLIC" | "MEMBERS_ONLY";
    topicId?: string;
    authorId?: string;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const filters = {
      status: params?.status ?? CommunityPostStatus.PUBLISHED,
      visibility: params?.visibility,
      topicId: params?.topicId,
      authorId: params?.authorId,
      search: params?.search,
    };

    const [data, total] = await Promise.all([
      communityRepository.listPosts({ ...filters, skip, take: limit }),
      communityRepository.countPosts(filters),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  getFeed: async (
    params: {
      page?: number;
      limit?: number;
      topicId?: string;
      search?: string;
    } = {},
    viewer?: { id?: string; role?: Role | null }
  ): Promise<PaginatedResponse<any>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const filters = {
      status: CommunityPostStatus.PUBLISHED,
      topicId: params.topicId,
      search: params.search,
    };

    // Members can see members-only posts, agents as well. Guests (if ever exposed) would be limited to PUBLIC.
    const visibilityFilter = viewer?.id ? undefined : "PUBLIC";

    const [data, total] = await Promise.all([
      communityRepository.listPosts({ ...filters, visibility: visibilityFilter, skip, take: limit }),
      communityRepository.countPosts({ ...filters, visibility: visibilityFilter }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  getPost: async (id: string, viewer?: { id?: string; role?: Role | null }) => {
    const post = await communityRepository.findPostById(id);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.status !== "PUBLISHED" && post.authorId !== viewer?.id && !isPrivileged(viewer?.role)) {
      throw ApiError.forbidden("You cannot view this post");
    }

    return post;
  },

  updatePost: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
      topicId?: string | null;
      status?: CommunityPostStatus;
      visibility?: "PUBLIC" | "MEMBERS_ONLY";
      isPinned?: boolean;
    },
    actor: { id?: string; role?: Role | null }
  ) => {
    const existing = await communityRepository.findPostById(id);
    if (!existing) {
      throw ApiError.notFound("Post not found");
    }

    assertAuthorOrPrivileged({ actorId: actor.id, actorRole: actor.role ?? null, authorId: existing.authorId });

    if (data.isPinned !== undefined && !isPrivileged(actor.role)) {
      throw ApiError.forbidden("Only managers or admins can pin posts");
    }

    const previousStatus = existing.status;
    const updated = await communityRepository.updatePost(id, {
      title: data.title ?? existing.title,
      content: data.content ?? existing.content,
      excerpt: buildExcerpt(
        data.content ?? existing.content,
        data.excerpt ?? existing.excerpt ?? undefined
      ),
      coverImage: data.coverImage ?? existing.coverImage ?? null,
      tags: data.tags ? (sanitizeTags(data.tags) as Prisma.InputJsonValue) : undefined,
      metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      topic: data.topicId === null
        ? { disconnect: true }
        : data.topicId
        ? { connect: { id: data.topicId } }
        : undefined,
      status: data.status ?? existing.status,
      visibility: data.visibility ?? existing.visibility,
      isPinned: data.isPinned ?? existing.isPinned,
      pinnedAt: data.isPinned !== undefined ? (data.isPinned ? new Date() : null) : existing.pinnedAt,
      publishedAt:
        data.status === CommunityPostStatus.PUBLISHED && !existing.publishedAt
          ? new Date()
          : data.status && data.status !== CommunityPostStatus.PUBLISHED
          ? null
          : existing.publishedAt,
      lastActivityAt: new Date(),
    });

    if (previousStatus !== CommunityPostStatus.PUBLISHED && updated.status === CommunityPostStatus.PUBLISHED) {
      await communityNotificationService.notifyPostPublished(updated as any);
    }

    return updated;
  },

  deletePost: async (id: string, actor: { id?: string; role?: Role | null }) => {
    const existing = await communityRepository.findPostById(id);
    if (!existing) {
      throw ApiError.notFound("Post not found");
    }

    assertAuthorOrPrivileged({ actorId: actor.id, actorRole: actor.role ?? null, authorId: existing.authorId });

    await communityRepository.deletePost(id);
    return { success: true };
  },

  flagPost: async (
    id: string,
    options: {
      actorId: string;
      reason?: string;
    }
  ) => {
    const post = await communityRepository.findPostById(id);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const metadata = metadataToObject(post.metadata);
    const flags = Array.isArray(metadata.flags) ? metadata.flags : [];
    flags.push({
      actorId: options.actorId,
      reason: options.reason,
      flaggedAt: new Date().toISOString(),
    });
    metadata.flags = flags;

    return communityRepository.updatePost(id, {
      status: CommunityPostStatus.FLAGGED,
      metadata: metadata as Prisma.InputJsonValue,
    });
  },

  moderatePost: async (
    id: string,
    data: {
      status: CommunityPostStatus;
      visibility?: "PUBLIC" | "MEMBERS_ONLY";
      isPinned?: boolean;
      notes?: string;
    },
    actor: { id?: string; role?: Role | null }
  ) => {
    if (!isPrivileged(actor.role)) {
      throw ApiError.forbidden("Only managers or admins can moderate posts");
    }

    const post = await communityRepository.findPostById(id);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const metadata = appendModerationNote(metadataToObject(post.metadata), {
      actorId: actor.id,
      notes: data.notes,
    });

    const publishedAt =
      data.status === CommunityPostStatus.PUBLISHED
        ? post.publishedAt ?? new Date()
        : data.status === CommunityPostStatus.DRAFT
        ? null
        : post.publishedAt;

    const updated = await communityRepository.updatePost(id, {
      status: data.status,
      visibility: data.visibility ?? post.visibility,
      isPinned: data.isPinned ?? post.isPinned,
      pinnedAt: data.isPinned !== undefined ? (data.isPinned ? new Date() : null) : post.pinnedAt,
      metadata: metadata as Prisma.InputJsonValue,
      publishedAt,
      lastActivityAt: new Date(),
    });

    if (post.status !== CommunityPostStatus.PUBLISHED && updated.status === CommunityPostStatus.PUBLISHED) {
      await communityNotificationService.notifyPostPublished(updated as any);
    }

    return updated;
  },

  reactToPost: async (
    postId: string,
    options: { userId: string; role?: Role | null; type?: CommunityReactionType }
  ) => {
    const post = await communityRepository.findPostById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.status !== CommunityPostStatus.PUBLISHED && post.authorId !== options.userId && !isPrivileged(options.role)) {
      throw ApiError.forbidden("Cannot react to unpublished posts");
    }

    const reactionType = options.type ?? CommunityReactionType.LIKE;
    const existing = await communityRepository.findReaction(postId, options.userId);

    let action: "added" | "removed" | "updated" = "added";

    if (existing && existing.type === reactionType) {
      await communityRepository.deleteReaction(existing.id);
      action = "removed";
    } else if (existing) {
      await communityRepository.updateReaction(existing.id, { type: reactionType });
      action = "updated";
    } else {
      await communityRepository.createReaction({
        type: reactionType,
        post: { connect: { id: postId } },
        user: { connect: { id: options.userId } },
      });
    }

    const count = await communityRepository.countReactions(postId);
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        reactionCount: count,
        ...(action !== "removed" ? { lastActivityAt: new Date() } : {}),
      },
    });

    return { action, count };
  },

  addComment: async (
    postId: string,
    options: { userId: string; role?: Role | null; content: string; parentId?: string }
  ) => {
    const post = await communityRepository.findPostById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.status !== CommunityPostStatus.PUBLISHED && post.authorId !== options.userId && !isPrivileged(options.role)) {
      throw ApiError.forbidden("Cannot comment on unpublished posts");
    }

    if (options.parentId) {
      const parent = await communityRepository.findCommentById(options.parentId);
      if (!parent || parent.postId !== postId) {
        throw ApiError.badRequest("Parent comment mismatch");
      }
    }

    const comment = await communityRepository.createComment({
      content: options.content,
      post: { connect: { id: postId } },
      parent: options.parentId ? { connect: { id: options.parentId } } : undefined,
      user: { connect: { id: options.userId } },
    });

    const count = await communityRepository.countComments(postId);
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        commentCount: count,
        lastActivityAt: new Date(),
      },
    });

    return comment;
  },

  listComments: (postId: string) => communityRepository.listComments(postId),

  listSubscriptions: async (actor: { id?: string }) => {
    const userId = requireAuthenticatedUser(actor.id);
    return communityRepository.listSubscriptionsByUser(userId);
  },

  subscribe: async (
    data: {
      topicId?: string;
      postId?: string;
      frequency?: CommunitySubscriptionFrequency;
      metadata?: Record<string, unknown>;
    },
    actor: { id?: string; role?: Role | null }
  ) => {
    const userId = requireAuthenticatedUser(actor.id);
    const target = resolveSubscriptionTarget({ topicId: data.topicId, postId: data.postId });

    if (target.topicId) {
      const topic = await communityRepository.findTopicById(target.topicId);
      if (!topic) {
        throw ApiError.notFound("Topic not found");
      }
    }

    if (target.postId) {
      const post = await communityRepository.findPostById(target.postId);
      if (!post) {
        throw ApiError.notFound("Post not found");
      }
      if (post.status !== CommunityPostStatus.PUBLISHED && post.authorId !== userId && !isPrivileged(actor.role)) {
        throw ApiError.forbidden("Cannot subscribe to unpublished posts");
      }
    }

    const existing = await communityRepository.findSubscription({
      userId,
      topicId: target.topicId ?? undefined,
      postId: target.postId ?? undefined,
    });

    const frequency = data.frequency ?? existing?.frequency ?? CommunitySubscriptionFrequency.INSTANT;
    const metadata = data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined;

    if (existing) {
      const updatePayload: Prisma.CommunitySubscriptionUpdateInput = { frequency };
      if (metadata !== undefined) {
        updatePayload.metadata = metadata;
      }
      return communityRepository.updateSubscription(existing.id, updatePayload);
    }

    const createPayload: Prisma.CommunitySubscriptionCreateInput = {
      frequency,
      user: { connect: { id: userId } },
      topic: target.topicId ? { connect: { id: target.topicId } } : undefined,
      post: target.postId ? { connect: { id: target.postId } } : undefined,
    };

    if (metadata !== undefined) {
      createPayload.metadata = metadata;
    }

    return communityRepository.createSubscription(createPayload);
  },

  unsubscribe: async (
    data: { topicId?: string; postId?: string },
    actor: { id?: string }
  ) => {
    const userId = requireAuthenticatedUser(actor.id);
    const target = resolveSubscriptionTarget(data);
    const existing = await communityRepository.findSubscription({
      userId,
      topicId: target.topicId ?? undefined,
      postId: target.postId ?? undefined,
    });

    if (!existing) {
      return { success: false };
    }

    await communityRepository.deleteSubscription(existing.id);
    return { success: true };
  },

  sendDigest: async (
    params: { sinceHours?: number } | undefined,
    actor: { id?: string; role?: Role | null }
  ) => {
    if (!isPrivileged(actor.role)) {
      throw ApiError.forbidden("Only managers or admins can trigger digests");
    }
    return communityNotificationService.sendDailyDigest({ sinceHours: params?.sinceHours, actorId: actor.id });
  },
};
