import { CommunityPostStatus, CommunityReactionType, CommunitySubscriptionFrequency, Prisma, Role } from "@prisma/client";
import { PaginatedResponse } from "../../utils/pagination";
export declare const communityService: {
    createTopic: (data: {
        name: string;
        slug?: string;
        description?: string;
        icon?: string;
        color?: string;
        metadata?: Record<string, unknown>;
        actorId?: string;
    }) => Promise<{
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
        metadata: Prisma.JsonValue | null;
        createdById: string | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }>;
    listTopics: (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) => Promise<PaginatedResponse<any>>;
    updateTopic: (id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        color?: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{
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
        metadata: Prisma.JsonValue | null;
        createdById: string | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }>;
    createPost: (data: {
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
    }) => Promise<{
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
    }>;
    listPosts: (params?: {
        page?: number;
        limit?: number;
        status?: CommunityPostStatus;
        visibility?: "PUBLIC" | "MEMBERS_ONLY";
        topicId?: string;
        authorId?: string;
        search?: string;
    }) => Promise<PaginatedResponse<any>>;
    getFeed: (params?: {
        page?: number;
        limit?: number;
        topicId?: string;
        search?: string;
    }, viewer?: {
        id?: string;
        role?: Role | null;
    }) => Promise<PaginatedResponse<any>>;
    getPost: (id: string, viewer?: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
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
    }>;
    updatePost: (id: string, data: {
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
    }, actor: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
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
    }>;
    deletePost: (id: string, actor: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
        success: boolean;
    }>;
    flagPost: (id: string, options: {
        actorId: string;
        reason?: string;
    }) => Promise<{
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
    }>;
    moderatePost: (id: string, data: {
        status: CommunityPostStatus;
        visibility?: "PUBLIC" | "MEMBERS_ONLY";
        isPinned?: boolean;
        notes?: string;
    }, actor: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
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
    }>;
    reactToPost: (postId: string, options: {
        userId: string;
        role?: Role | null;
        type?: CommunityReactionType;
    }) => Promise<{
        action: "added" | "removed" | "updated";
        count: number;
    }>;
    addComment: (postId: string, options: {
        userId: string;
        role?: Role | null;
        content: string;
        parentId?: string;
    }) => Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommunityCommentStatus;
        userId: string;
        metadata: Prisma.JsonValue | null;
        content: string;
        postId: string;
        parentId: string | null;
    }>;
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
        userId: string;
        metadata: Prisma.JsonValue | null;
        content: string;
        postId: string;
        parentId: string | null;
    })[]>;
    listSubscriptions: (actor: {
        id?: string;
    }) => Promise<({
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
        userId: string;
        metadata: Prisma.JsonValue | null;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    })[]>;
    subscribe: (data: {
        topicId?: string;
        postId?: string;
        frequency?: CommunitySubscriptionFrequency;
        metadata?: Record<string, unknown>;
    }, actor: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
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
        userId: string;
        metadata: Prisma.JsonValue | null;
        topicId: string | null;
        postId: string | null;
        frequency: import(".prisma/client").$Enums.CommunitySubscriptionFrequency;
    }>;
    unsubscribe: (data: {
        topicId?: string;
        postId?: string;
    }, actor: {
        id?: string;
    }) => Promise<{
        success: boolean;
    }>;
    sendDigest: (params: {
        sinceHours?: number;
    } | undefined, actor: {
        id?: string;
        role?: Role | null;
    }) => Promise<{
        scheduled: number;
        since: Date;
    }>;
};
//# sourceMappingURL=community.service.d.ts.map