"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const community_repository_1 = require("./community.repository");
const prisma_1 = require("../../config/prisma");
const community_notification_service_1 = require("./community.notification.service");
const randomSuffix = () => Math.random().toString(36).slice(2, 8);
const normalizeSlug = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
const ensureSlugSeed = (value, prefix) => {
    const normalized = normalizeSlug(value);
    return normalized || `${prefix}-${randomSuffix()}`;
};
const buildExcerpt = (content, existing) => existing ?? content.substring(0, 240).trim();
const ensureUniquePostSlug = async (incoming) => {
    let slug = incoming;
    let counter = 1;
    while (await community_repository_1.communityRepository.findPostBySlug(slug)) {
        slug = `${incoming}-${counter++}`;
    }
    return slug;
};
const ensureUniqueTopicSlug = async (incoming) => {
    let slug = incoming;
    let counter = 1;
    while (await community_repository_1.communityRepository.findTopicBySlug(slug)) {
        slug = `${incoming}-${counter++}`;
    }
    return slug;
};
const isPrivileged = (role) => role === "ADMIN" || role === "MANAGER";
const assertAuthorOrPrivileged = (params) => {
    if (!params.actorId) {
        throw ApiError_1.ApiError.forbidden("Authentication required");
    }
    if (params.actorId !== params.authorId && !isPrivileged(params.actorRole)) {
        throw ApiError_1.ApiError.forbidden("You cannot modify this post");
    }
};
const sanitizeTags = (tags) => (tags ? Array.from(new Set(tags)) : undefined);
const metadataToObject = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }
    return { ...value };
};
const appendModerationNote = (metadata, entry) => {
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
const requireAuthenticatedUser = (actorId) => {
    if (!actorId) {
        throw ApiError_1.ApiError.unauthorized("Authentication required");
    }
    return actorId;
};
const resolveSubscriptionTarget = (data) => {
    const hasTopic = Boolean(data.topicId);
    const hasPost = Boolean(data.postId);
    if ((hasTopic && hasPost) || (!hasTopic && !hasPost)) {
        throw ApiError_1.ApiError.badRequest("Provide either topicId or postId");
    }
    return {
        topicId: data.topicId ?? null,
        postId: data.postId ?? null,
    };
};
exports.communityService = {
    createTopic: async (data) => {
        const slugBase = ensureSlugSeed(data.slug ?? data.name, "topic");
        const slug = await ensureUniqueTopicSlug(slugBase);
        return community_repository_1.communityRepository.createTopic({
            name: data.name,
            slug,
            description: data.description,
            icon: data.icon,
            color: data.color,
            metadata: data.metadata ? data.metadata : undefined,
            createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
        });
    },
    listTopics: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            community_repository_1.communityRepository.listTopics({ skip, take: limit, search: params?.search }),
            community_repository_1.communityRepository.countTopics({ search: params?.search }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    updateTopic: async (id, data) => {
        const existing = await community_repository_1.communityRepository.findTopicById(id);
        if (!existing) {
            throw ApiError_1.ApiError.notFound("Topic not found");
        }
        const slugInput = data.slug
            ? ensureSlugSeed(data.slug, "topic")
            : data.name
                ? ensureSlugSeed(data.name, "topic")
                : existing.slug;
        const slug = slugInput === existing.slug ? existing.slug : await ensureUniqueTopicSlug(slugInput);
        return community_repository_1.communityRepository.updateTopic(id, {
            name: data.name ?? existing.name,
            slug,
            description: data.description ?? existing.description ?? null,
            icon: data.icon ?? existing.icon ?? null,
            color: data.color ?? existing.color ?? null,
            metadata: data.metadata ? data.metadata : undefined,
        });
    },
    createPost: async (data) => {
        const baseSlug = ensureSlugSeed(data.title, "post");
        const slug = await ensureUniquePostSlug(baseSlug);
        const status = data.status ?? client_1.CommunityPostStatus.DRAFT;
        const post = await community_repository_1.communityRepository.createPost({
            title: data.title,
            slug,
            content: data.content,
            excerpt: buildExcerpt(data.content, data.excerpt),
            coverImage: data.coverImage,
            tags: data.tags ? sanitizeTags(data.tags) : undefined,
            metadata: data.metadata ? data.metadata : undefined,
            status,
            visibility: data.visibility ?? "PUBLIC",
            isPinned: data.isPinned ?? false,
            pinnedAt: data.isPinned ? new Date() : undefined,
            publishedAt: status === client_1.CommunityPostStatus.PUBLISHED ? new Date() : undefined,
            lastActivityAt: new Date(),
            author: { connect: { id: data.authorId } },
            topic: data.topicId ? { connect: { id: data.topicId } } : undefined,
        });
        if (post.status === client_1.CommunityPostStatus.PUBLISHED) {
            await community_notification_service_1.communityNotificationService.notifyPostPublished(post);
        }
        return post;
    },
    listPosts: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const filters = {
            status: params?.status ?? client_1.CommunityPostStatus.PUBLISHED,
            visibility: params?.visibility,
            topicId: params?.topicId,
            authorId: params?.authorId,
            search: params?.search,
        };
        const [data, total] = await Promise.all([
            community_repository_1.communityRepository.listPosts({ ...filters, skip, take: limit }),
            community_repository_1.communityRepository.countPosts(filters),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    getFeed: async (params = {}, viewer) => {
        const page = params.page ?? 1;
        const limit = params.limit ?? 10;
        const skip = (page - 1) * limit;
        const filters = {
            status: client_1.CommunityPostStatus.PUBLISHED,
            topicId: params.topicId,
            search: params.search,
        };
        // Members can see members-only posts, agents as well. Guests (if ever exposed) would be limited to PUBLIC.
        const visibilityFilter = viewer?.id ? undefined : "PUBLIC";
        const [data, total] = await Promise.all([
            community_repository_1.communityRepository.listPosts({ ...filters, visibility: visibilityFilter, skip, take: limit }),
            community_repository_1.communityRepository.countPosts({ ...filters, visibility: visibilityFilter }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    getPost: async (id, viewer) => {
        const post = await community_repository_1.communityRepository.findPostById(id);
        if (!post) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        if (post.status !== "PUBLISHED" && post.authorId !== viewer?.id && !isPrivileged(viewer?.role)) {
            throw ApiError_1.ApiError.forbidden("You cannot view this post");
        }
        return post;
    },
    updatePost: async (id, data, actor) => {
        const existing = await community_repository_1.communityRepository.findPostById(id);
        if (!existing) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        assertAuthorOrPrivileged({ actorId: actor.id, actorRole: actor.role ?? null, authorId: existing.authorId });
        if (data.isPinned !== undefined && !isPrivileged(actor.role)) {
            throw ApiError_1.ApiError.forbidden("Only managers or admins can pin posts");
        }
        const previousStatus = existing.status;
        const updated = await community_repository_1.communityRepository.updatePost(id, {
            title: data.title ?? existing.title,
            content: data.content ?? existing.content,
            excerpt: buildExcerpt(data.content ?? existing.content, data.excerpt ?? existing.excerpt ?? undefined),
            coverImage: data.coverImage ?? existing.coverImage ?? null,
            tags: data.tags ? sanitizeTags(data.tags) : undefined,
            metadata: data.metadata ? data.metadata : undefined,
            topic: data.topicId === null
                ? { disconnect: true }
                : data.topicId
                    ? { connect: { id: data.topicId } }
                    : undefined,
            status: data.status ?? existing.status,
            visibility: data.visibility ?? existing.visibility,
            isPinned: data.isPinned ?? existing.isPinned,
            pinnedAt: data.isPinned !== undefined ? (data.isPinned ? new Date() : null) : existing.pinnedAt,
            publishedAt: data.status === client_1.CommunityPostStatus.PUBLISHED && !existing.publishedAt
                ? new Date()
                : data.status && data.status !== client_1.CommunityPostStatus.PUBLISHED
                    ? null
                    : existing.publishedAt,
            lastActivityAt: new Date(),
        });
        if (previousStatus !== client_1.CommunityPostStatus.PUBLISHED && updated.status === client_1.CommunityPostStatus.PUBLISHED) {
            await community_notification_service_1.communityNotificationService.notifyPostPublished(updated);
        }
        return updated;
    },
    deletePost: async (id, actor) => {
        const existing = await community_repository_1.communityRepository.findPostById(id);
        if (!existing) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        assertAuthorOrPrivileged({ actorId: actor.id, actorRole: actor.role ?? null, authorId: existing.authorId });
        await community_repository_1.communityRepository.deletePost(id);
        return { success: true };
    },
    flagPost: async (id, options) => {
        const post = await community_repository_1.communityRepository.findPostById(id);
        if (!post) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        const metadata = metadataToObject(post.metadata);
        const flags = Array.isArray(metadata.flags) ? metadata.flags : [];
        flags.push({
            actorId: options.actorId,
            reason: options.reason,
            flaggedAt: new Date().toISOString(),
        });
        metadata.flags = flags;
        return community_repository_1.communityRepository.updatePost(id, {
            status: client_1.CommunityPostStatus.FLAGGED,
            metadata: metadata,
        });
    },
    moderatePost: async (id, data, actor) => {
        if (!isPrivileged(actor.role)) {
            throw ApiError_1.ApiError.forbidden("Only managers or admins can moderate posts");
        }
        const post = await community_repository_1.communityRepository.findPostById(id);
        if (!post) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        const metadata = appendModerationNote(metadataToObject(post.metadata), {
            actorId: actor.id,
            notes: data.notes,
        });
        const publishedAt = data.status === client_1.CommunityPostStatus.PUBLISHED
            ? post.publishedAt ?? new Date()
            : data.status === client_1.CommunityPostStatus.DRAFT
                ? null
                : post.publishedAt;
        const updated = await community_repository_1.communityRepository.updatePost(id, {
            status: data.status,
            visibility: data.visibility ?? post.visibility,
            isPinned: data.isPinned ?? post.isPinned,
            pinnedAt: data.isPinned !== undefined ? (data.isPinned ? new Date() : null) : post.pinnedAt,
            metadata: metadata,
            publishedAt,
            lastActivityAt: new Date(),
        });
        if (post.status !== client_1.CommunityPostStatus.PUBLISHED && updated.status === client_1.CommunityPostStatus.PUBLISHED) {
            await community_notification_service_1.communityNotificationService.notifyPostPublished(updated);
        }
        return updated;
    },
    reactToPost: async (postId, options) => {
        const post = await community_repository_1.communityRepository.findPostById(postId);
        if (!post) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        if (post.status !== client_1.CommunityPostStatus.PUBLISHED && post.authorId !== options.userId && !isPrivileged(options.role)) {
            throw ApiError_1.ApiError.forbidden("Cannot react to unpublished posts");
        }
        const reactionType = options.type ?? client_1.CommunityReactionType.LIKE;
        const existing = await community_repository_1.communityRepository.findReaction(postId, options.userId);
        let action = "added";
        if (existing && existing.type === reactionType) {
            await community_repository_1.communityRepository.deleteReaction(existing.id);
            action = "removed";
        }
        else if (existing) {
            await community_repository_1.communityRepository.updateReaction(existing.id, { type: reactionType });
            action = "updated";
        }
        else {
            await community_repository_1.communityRepository.createReaction({
                type: reactionType,
                post: { connect: { id: postId } },
                user: { connect: { id: options.userId } },
            });
        }
        const count = await community_repository_1.communityRepository.countReactions(postId);
        await prisma_1.prisma.communityPost.update({
            where: { id: postId },
            data: {
                reactionCount: count,
                ...(action !== "removed" ? { lastActivityAt: new Date() } : {}),
            },
        });
        return { action, count };
    },
    addComment: async (postId, options) => {
        const post = await community_repository_1.communityRepository.findPostById(postId);
        if (!post) {
            throw ApiError_1.ApiError.notFound("Post not found");
        }
        if (post.status !== client_1.CommunityPostStatus.PUBLISHED && post.authorId !== options.userId && !isPrivileged(options.role)) {
            throw ApiError_1.ApiError.forbidden("Cannot comment on unpublished posts");
        }
        if (options.parentId) {
            const parent = await community_repository_1.communityRepository.findCommentById(options.parentId);
            if (!parent || parent.postId !== postId) {
                throw ApiError_1.ApiError.badRequest("Parent comment mismatch");
            }
        }
        const comment = await community_repository_1.communityRepository.createComment({
            content: options.content,
            post: { connect: { id: postId } },
            parent: options.parentId ? { connect: { id: options.parentId } } : undefined,
            user: { connect: { id: options.userId } },
        });
        const count = await community_repository_1.communityRepository.countComments(postId);
        await prisma_1.prisma.communityPost.update({
            where: { id: postId },
            data: {
                commentCount: count,
                lastActivityAt: new Date(),
            },
        });
        return comment;
    },
    listComments: (postId) => community_repository_1.communityRepository.listComments(postId),
    listSubscriptions: async (actor) => {
        const userId = requireAuthenticatedUser(actor.id);
        return community_repository_1.communityRepository.listSubscriptionsByUser(userId);
    },
    subscribe: async (data, actor) => {
        const userId = requireAuthenticatedUser(actor.id);
        const target = resolveSubscriptionTarget({ topicId: data.topicId, postId: data.postId });
        if (target.topicId) {
            const topic = await community_repository_1.communityRepository.findTopicById(target.topicId);
            if (!topic) {
                throw ApiError_1.ApiError.notFound("Topic not found");
            }
        }
        if (target.postId) {
            const post = await community_repository_1.communityRepository.findPostById(target.postId);
            if (!post) {
                throw ApiError_1.ApiError.notFound("Post not found");
            }
            if (post.status !== client_1.CommunityPostStatus.PUBLISHED && post.authorId !== userId && !isPrivileged(actor.role)) {
                throw ApiError_1.ApiError.forbidden("Cannot subscribe to unpublished posts");
            }
        }
        const existing = await community_repository_1.communityRepository.findSubscription({
            userId,
            topicId: target.topicId ?? undefined,
            postId: target.postId ?? undefined,
        });
        const frequency = data.frequency ?? existing?.frequency ?? client_1.CommunitySubscriptionFrequency.INSTANT;
        const metadata = data.metadata ? data.metadata : undefined;
        if (existing) {
            const updatePayload = { frequency };
            if (metadata !== undefined) {
                updatePayload.metadata = metadata;
            }
            return community_repository_1.communityRepository.updateSubscription(existing.id, updatePayload);
        }
        const createPayload = {
            frequency,
            user: { connect: { id: userId } },
            topic: target.topicId ? { connect: { id: target.topicId } } : undefined,
            post: target.postId ? { connect: { id: target.postId } } : undefined,
        };
        if (metadata !== undefined) {
            createPayload.metadata = metadata;
        }
        return community_repository_1.communityRepository.createSubscription(createPayload);
    },
    unsubscribe: async (data, actor) => {
        const userId = requireAuthenticatedUser(actor.id);
        const target = resolveSubscriptionTarget(data);
        const existing = await community_repository_1.communityRepository.findSubscription({
            userId,
            topicId: target.topicId ?? undefined,
            postId: target.postId ?? undefined,
        });
        if (!existing) {
            return { success: false };
        }
        await community_repository_1.communityRepository.deleteSubscription(existing.id);
        return { success: true };
    },
    sendDigest: async (params, actor) => {
        if (!isPrivileged(actor.role)) {
            throw ApiError_1.ApiError.forbidden("Only managers or admins can trigger digests");
        }
        return community_notification_service_1.communityNotificationService.sendDailyDigest({ sinceHours: params?.sinceHours, actorId: actor.id });
    },
};
//# sourceMappingURL=community.service.js.map