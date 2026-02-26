"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRepository = void 0;
const prisma_1 = require("../../config/prisma");
const topicInclude = {
    createdBy: { select: { id: true, name: true } },
};
const postInclude = {
    author: { select: { id: true, name: true, role: true } },
    topic: { select: { id: true, name: true, slug: true } },
};
const commentInclude = {
    user: { select: { id: true, name: true } },
};
const subscriptionInclude = {
    user: { select: { id: true, name: true, email: true } },
    topic: { select: { id: true, name: true, slug: true } },
    post: { select: { id: true, title: true, slug: true } },
};
exports.communityRepository = {
    createTopic: (data) => prisma_1.prisma.communityTopic.create({ data, include: topicInclude }),
    updateTopic: (id, data) => prisma_1.prisma.communityTopic.update({ where: { id }, data, include: topicInclude }),
    listTopics: (params) => {
        const where = params?.search
            ? { name: { contains: params.search, mode: "insensitive" } }
            : {};
        return prisma_1.prisma.communityTopic.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: params?.skip,
            take: params?.take,
            include: topicInclude,
        });
    },
    countTopics: (params) => {
        const where = params?.search
            ? { name: { contains: params.search, mode: "insensitive" } }
            : {};
        return prisma_1.prisma.communityTopic.count({ where });
    },
    findTopicById: (id) => prisma_1.prisma.communityTopic.findUnique({ where: { id }, include: topicInclude }),
    findTopicBySlug: (slug) => prisma_1.prisma.communityTopic.findUnique({ where: { slug }, include: topicInclude }),
    createPost: (data) => prisma_1.prisma.communityPost.create({ data, include: postInclude }),
    updatePost: (id, data) => prisma_1.prisma.communityPost.update({ where: { id }, data, include: postInclude }),
    deletePost: (id) => prisma_1.prisma.communityPost.delete({ where: { id } }),
    findPostById: (id) => prisma_1.prisma.communityPost.findUnique({ where: { id }, include: postInclude }),
    findPostBySlug: (slug) => prisma_1.prisma.communityPost.findUnique({ where: { slug }, include: postInclude }),
    listPosts: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.visibility) {
            where.visibility = params.visibility;
        }
        if (params?.topicId) {
            where.topicId = params.topicId;
        }
        if (params?.authorId) {
            where.authorId = params.authorId;
        }
        if (params?.search) {
            where.OR = [
                { title: { contains: params.search, mode: "insensitive" } },
                { content: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.communityPost.findMany({
            where,
            orderBy: [
                { isPinned: "desc" },
                { lastActivityAt: "desc" },
                { createdAt: "desc" },
            ],
            skip: params?.skip,
            take: params?.take,
            include: postInclude,
        });
    },
    countPosts: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.visibility) {
            where.visibility = params.visibility;
        }
        if (params?.topicId) {
            where.topicId = params.topicId;
        }
        if (params?.authorId) {
            where.authorId = params.authorId;
        }
        if (params?.search) {
            where.OR = [
                { title: { contains: params.search, mode: "insensitive" } },
                { content: { contains: params.search, mode: "insensitive" } },
            ];
        }
        return prisma_1.prisma.communityPost.count({ where });
    },
    findReaction: (postId, userId) => prisma_1.prisma.communityReaction.findUnique({ where: { postId_userId: { postId, userId } } }),
    createReaction: (data) => prisma_1.prisma.communityReaction.create({ data }),
    updateReaction: (id, data) => prisma_1.prisma.communityReaction.update({ where: { id }, data }),
    deleteReaction: (id) => prisma_1.prisma.communityReaction.delete({ where: { id } }),
    countReactions: (postId) => prisma_1.prisma.communityReaction.count({ where: { postId } }),
    createComment: (data) => prisma_1.prisma.communityComment.create({ data, include: commentInclude }),
    listComments: (postId) => prisma_1.prisma.communityComment.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
        include: commentInclude,
    }),
    countComments: (postId) => prisma_1.prisma.communityComment.count({ where: { postId } }),
    findCommentById: (id) => prisma_1.prisma.communityComment.findUnique({ where: { id }, include: commentInclude }),
    findSubscription: (params) => prisma_1.prisma.communitySubscription.findFirst({
        where: {
            userId: params.userId,
            topicId: params.topicId ?? null,
            postId: params.postId ?? null,
        },
        include: subscriptionInclude,
    }),
    createSubscription: (data) => prisma_1.prisma.communitySubscription.create({ data, include: subscriptionInclude }),
    updateSubscription: (id, data) => prisma_1.prisma.communitySubscription.update({ where: { id }, data, include: subscriptionInclude }),
    deleteSubscription: (id) => prisma_1.prisma.communitySubscription.delete({ where: { id } }),
    listSubscriptionsByUser: (userId) => prisma_1.prisma.communitySubscription.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: subscriptionInclude,
    }),
    listSubscribersForPost: (params) => prisma_1.prisma.communitySubscription.findMany({
        where: {
            frequency: params.frequency,
            OR: [
                { postId: params.postId },
                params.topicId ? { topicId: params.topicId } : undefined,
            ].filter(Boolean),
        },
        include: subscriptionInclude,
    }),
    listDigestSubscribers: () => prisma_1.prisma.communitySubscription.findMany({
        where: { frequency: "DAILY" },
        include: subscriptionInclude,
    }),
    findPostsPublishedSince: (since) => prisma_1.prisma.communityPost.findMany({
        where: {
            status: "PUBLISHED",
            publishedAt: { gte: since },
        },
        orderBy: [{ publishedAt: "desc" }],
        include: postInclude,
    }),
};
//# sourceMappingURL=community.repository.js.map