import { CommunitySubscriptionFrequency, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

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

export const communityRepository = {
  createTopic: (data: Prisma.CommunityTopicCreateInput) =>
    prisma.communityTopic.create({ data, include: topicInclude }),

  updateTopic: (id: string, data: Prisma.CommunityTopicUpdateInput) =>
    prisma.communityTopic.update({ where: { id }, data, include: topicInclude }),

  listTopics: (params?: { skip?: number; take?: number; search?: string }) => {
    const where: Prisma.CommunityTopicWhereInput = params?.search
      ? { name: { contains: params.search, mode: "insensitive" } }
      : {};

    return prisma.communityTopic.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params?.skip,
      take: params?.take,
      include: topicInclude,
    });
  },

  countTopics: (params?: { search?: string }) => {
    const where: Prisma.CommunityTopicWhereInput = params?.search
      ? { name: { contains: params.search, mode: "insensitive" } }
      : {};
    return prisma.communityTopic.count({ where });
  },

  findTopicById: (id: string) =>
    prisma.communityTopic.findUnique({ where: { id }, include: topicInclude }),

  findTopicBySlug: (slug: string) =>
    prisma.communityTopic.findUnique({ where: { slug }, include: topicInclude }),

  createPost: (data: Prisma.CommunityPostCreateInput) =>
    prisma.communityPost.create({ data, include: postInclude }),

  updatePost: (id: string, data: Prisma.CommunityPostUpdateInput) =>
    prisma.communityPost.update({ where: { id }, data, include: postInclude }),

  deletePost: (id: string) => prisma.communityPost.delete({ where: { id } }),

  findPostById: (id: string) =>
    prisma.communityPost.findUnique({ where: { id }, include: postInclude }),

  findPostBySlug: (slug: string) =>
    prisma.communityPost.findUnique({ where: { slug }, include: postInclude }),

  listPosts: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    visibility?: string;
    topicId?: string;
    authorId?: string;
    search?: string;
  }) => {
    const where: Prisma.CommunityPostWhereInput = {};

    if (params?.status) {
      where.status = params.status as Prisma.CommunityPostWhereInput["status"];
    }

    if (params?.visibility) {
      where.visibility = params.visibility as Prisma.CommunityPostWhereInput["visibility"];
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

    return prisma.communityPost.findMany({
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

  countPosts: (params?: {
    status?: string;
    visibility?: string;
    topicId?: string;
    authorId?: string;
    search?: string;
  }) => {
    const where: Prisma.CommunityPostWhereInput = {};

    if (params?.status) {
      where.status = params.status as Prisma.CommunityPostWhereInput["status"];
    }

    if (params?.visibility) {
      where.visibility = params.visibility as Prisma.CommunityPostWhereInput["visibility"];
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

    return prisma.communityPost.count({ where });
  },

  findReaction: (postId: string, userId: string) =>
    prisma.communityReaction.findUnique({ where: { postId_userId: { postId, userId } } }),

  createReaction: (data: Prisma.CommunityReactionCreateInput) =>
    prisma.communityReaction.create({ data }),

  updateReaction: (id: string, data: Prisma.CommunityReactionUpdateInput) =>
    prisma.communityReaction.update({ where: { id }, data }),

  deleteReaction: (id: string) => prisma.communityReaction.delete({ where: { id } }),

  countReactions: (postId: string) => prisma.communityReaction.count({ where: { postId } }),

  createComment: (data: Prisma.CommunityCommentCreateInput) =>
    prisma.communityComment.create({ data, include: commentInclude }),

  listComments: (postId: string) =>
    prisma.communityComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: commentInclude,
    }),

  countComments: (postId: string) => prisma.communityComment.count({ where: { postId } }),

  findCommentById: (id: string) =>
    prisma.communityComment.findUnique({ where: { id }, include: commentInclude }),

  findSubscription: (params: { userId: string; topicId?: string; postId?: string }) =>
    prisma.communitySubscription.findFirst({
      where: {
        userId: params.userId,
        topicId: params.topicId ?? null,
        postId: params.postId ?? null,
      },
      include: subscriptionInclude,
    }),

  createSubscription: (data: Prisma.CommunitySubscriptionCreateInput) =>
    prisma.communitySubscription.create({ data, include: subscriptionInclude }),

  updateSubscription: (id: string, data: Prisma.CommunitySubscriptionUpdateInput) =>
    prisma.communitySubscription.update({ where: { id }, data, include: subscriptionInclude }),

  deleteSubscription: (id: string) => prisma.communitySubscription.delete({ where: { id } }),

  listSubscriptionsByUser: (userId: string) =>
    prisma.communitySubscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: subscriptionInclude,
    }),

  listSubscribersForPost: (params: {
    postId: string;
    topicId?: string | null;
    frequency: CommunitySubscriptionFrequency;
  }) =>
    prisma.communitySubscription.findMany({
      where: {
        frequency: params.frequency,
        OR: [
          { postId: params.postId },
          params.topicId ? { topicId: params.topicId } : undefined,
        ].filter(Boolean) as Prisma.CommunitySubscriptionWhereInput[],
      },
      include: subscriptionInclude,
    }),

  listDigestSubscribers: () =>
    prisma.communitySubscription.findMany({
      where: { frequency: "DAILY" },
      include: subscriptionInclude,
    }),

  findPostsPublishedSince: (since: Date) =>
    prisma.communityPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: since },
      },
      orderBy: [{ publishedAt: "desc" }],
      include: postInclude,
    }),
};
