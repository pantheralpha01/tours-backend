import { CommunitySubscriptionFrequency, Prisma } from "@prisma/client";
export declare const communityRepository: {
    createTopic: (data: Prisma.CommunityTopicCreateInput) => Prisma.Prisma__CommunityTopicClient<{
        createdBy: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        metadata: Prisma.JsonValue | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updateTopic: (id: string, data: Prisma.CommunityTopicUpdateInput) => Prisma.Prisma__CommunityTopicClient<{
        createdBy: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        metadata: Prisma.JsonValue | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    listTopics: (params?: {
        skip?: number;
        take?: number;
        search?: string;
    }) => Prisma.PrismaPromise<({
        createdBy: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        metadata: Prisma.JsonValue | null;
        slug: string;
        icon: string | null;
        color: string | null;
    })[]>;
    countTopics: (params?: {
        search?: string;
    }) => Prisma.PrismaPromise<number>;
    findTopicById: (id: string) => Prisma.Prisma__CommunityTopicClient<({
        createdBy: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        metadata: Prisma.JsonValue | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findTopicBySlug: (slug: string) => Prisma.Prisma__CommunityTopicClient<({
        createdBy: {
            name: string;
            id: string;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        metadata: Prisma.JsonValue | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    createPost: (data: Prisma.CommunityPostCreateInput) => Prisma.Prisma__CommunityPostClient<{
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updatePost: (id: string, data: Prisma.CommunityPostUpdateInput) => Prisma.Prisma__CommunityPostClient<{
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    deletePost: (id: string) => Prisma.Prisma__CommunityPostClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findPostById: (id: string) => Prisma.Prisma__CommunityPostClient<({
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findPostBySlug: (slug: string) => Prisma.Prisma__CommunityPostClient<({
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    listPosts: (params?: {
        skip?: number;
        take?: number;
        status?: string;
        visibility?: string;
        topicId?: string;
        authorId?: string;
        search?: string;
    }) => Prisma.PrismaPromise<({
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    })[]>;
    countPosts: (params?: {
        status?: string;
        visibility?: string;
        topicId?: string;
        authorId?: string;
        search?: string;
    }) => Prisma.PrismaPromise<number>;
    findReaction: (postId: string, userId: string) => Prisma.Prisma__CommunityReactionClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.CommunityReactionType;
        userId: string;
        postId: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    createReaction: (data: Prisma.CommunityReactionCreateInput) => Prisma.Prisma__CommunityReactionClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.CommunityReactionType;
        userId: string;
        postId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updateReaction: (id: string, data: Prisma.CommunityReactionUpdateInput) => Prisma.Prisma__CommunityReactionClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.CommunityReactionType;
        userId: string;
        postId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteReaction: (id: string) => Prisma.Prisma__CommunityReactionClient<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.CommunityReactionType;
        userId: string;
        postId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    countReactions: (postId: string) => Prisma.PrismaPromise<number>;
    createComment: (data: Prisma.CommunityCommentCreateInput) => Prisma.Prisma__CommunityCommentClient<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityCommentStatus;
        metadata: Prisma.JsonValue | null;
        userId: string;
        content: string;
        postId: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    listComments: (postId: string) => Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityCommentStatus;
        metadata: Prisma.JsonValue | null;
        userId: string;
        content: string;
        postId: string;
        parentId: string | null;
    })[]>;
    countComments: (postId: string) => Prisma.PrismaPromise<number>;
    findCommentById: (id: string) => Prisma.Prisma__CommunityCommentClient<({
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityCommentStatus;
        metadata: Prisma.JsonValue | null;
        userId: string;
        content: string;
        postId: string;
        parentId: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    findSubscription: (params: {
        userId: string;
        topicId?: string;
        postId?: string;
    }) => Prisma.Prisma__CommunitySubscriptionClient<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    createSubscription: (data: Prisma.CommunitySubscriptionCreateInput) => Prisma.Prisma__CommunitySubscriptionClient<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updateSubscription: (id: string, data: Prisma.CommunitySubscriptionUpdateInput) => Prisma.Prisma__CommunitySubscriptionClient<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteSubscription: (id: string) => Prisma.Prisma__CommunitySubscriptionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    listSubscriptionsByUser: (userId: string) => Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    })[]>;
    listSubscribersForPost: (params: {
        postId: string;
        topicId?: string | null;
        frequency: CommunitySubscriptionFrequency;
    }) => Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    })[]>;
    listDigestSubscribers: () => Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
        post: {
            id: string;
            title: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: Prisma.JsonValue | null;
        userId: string;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    })[]>;
    findPostsPublishedSince: (since: Date) => Prisma.PrismaPromise<({
        author: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
        };
        topic: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityPostStatus;
        title: string;
        metadata: Prisma.JsonValue | null;
        slug: string;
        publishedAt: Date | null;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        tags: Prisma.JsonValue | null;
        visibility: import(".prisma/client").$Enums.CommunityVisibility;
        isPinned: boolean;
        pinnedAt: Date | null;
        lastActivityAt: Date;
        reactionCount: number;
        commentCount: number;
        authorId: string;
        topicId: string | null;
    })[]>;
};
//# sourceMappingURL=community.repository.d.ts.map