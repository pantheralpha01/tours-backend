import { z } from "zod";
export declare const communityPostStatusEnum: z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>;
export declare const communityVisibilityEnum: z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>;
export declare const communityReactionEnum: z.ZodEnum<["LIKE", "LOVE", "INSIGHTFUL", "CURIOUS"]>;
export declare const communitySubscriptionFrequencyEnum: z.ZodEnum<["INSTANT", "DAILY"]>;
export declare const createTopicSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>;
export declare const updateTopicSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>;
export declare const listTopicsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const topicIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    topicId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>>;
    visibility: z.ZodOptional<z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>>;
    isPinned: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    metadata?: Record<string, any> | undefined;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
    topicId?: string | undefined;
}, {
    title: string;
    content: string;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    metadata?: Record<string, any> | undefined;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
    topicId?: string | undefined;
}>;
export declare const updatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coverImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>>>;
    visibility: z.ZodOptional<z.ZodOptional<z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>>>;
    isPinned: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
} & {
    topicId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
    topicId?: string | null | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
    topicId?: string | null | undefined;
}>;
export declare const listPostsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>>;
    visibility: z.ZodOptional<z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>>;
    topicId: z.ZodOptional<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    authorId?: string | undefined;
    topicId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    authorId?: string | undefined;
    topicId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const postIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const reactionSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["LIKE", "LOVE", "INSIGHTFUL", "CURIOUS"]>>;
}, "strip", z.ZodTypeAny, {
    type?: "LIKE" | "LOVE" | "INSIGHTFUL" | "CURIOUS" | undefined;
}, {
    type?: "LIKE" | "LOVE" | "INSIGHTFUL" | "CURIOUS" | undefined;
}>;
export declare const commentSchema: z.ZodObject<{
    content: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string;
    parentId?: string | undefined;
}, {
    content: string;
    parentId?: string | undefined;
}>;
export declare const commentIdParamSchema: z.ZodObject<{
    commentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    commentId: string;
}, {
    commentId: string;
}>;
export declare const feedQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>>;
    visibility: z.ZodOptional<z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>>;
    topicId: z.ZodOptional<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
} & {
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    authorId?: string | undefined;
    topicId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED" | undefined;
    tags?: string[] | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    authorId?: string | undefined;
    topicId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const flagPostSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export declare const moderatePostSchema: z.ZodObject<{
    status: z.ZodEnum<["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]>;
    visibility: z.ZodOptional<z.ZodEnum<["PUBLIC", "MEMBERS_ONLY"]>>;
    isPinned: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED";
    notes?: string | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
}, {
    status: "DRAFT" | "PUBLISHED" | "FLAGGED" | "ARCHIVED";
    notes?: string | undefined;
    visibility?: "PUBLIC" | "MEMBERS_ONLY" | undefined;
    isPinned?: boolean | undefined;
}>;
export declare const subscriptionSchema: z.ZodEffects<z.ZodObject<{
    topicId: z.ZodOptional<z.ZodString>;
    postId: z.ZodOptional<z.ZodString>;
} & {
    frequency: z.ZodOptional<z.ZodEnum<["INSTANT", "DAILY"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    metadata?: Record<string, any> | undefined;
    topicId?: string | undefined;
    postId?: string | undefined;
    frequency?: "INSTANT" | "DAILY" | undefined;
}, {
    metadata?: Record<string, any> | undefined;
    topicId?: string | undefined;
    postId?: string | undefined;
    frequency?: "INSTANT" | "DAILY" | undefined;
}>, {
    metadata?: Record<string, any> | undefined;
    topicId?: string | undefined;
    postId?: string | undefined;
    frequency?: "INSTANT" | "DAILY" | undefined;
}, {
    metadata?: Record<string, any> | undefined;
    topicId?: string | undefined;
    postId?: string | undefined;
    frequency?: "INSTANT" | "DAILY" | undefined;
}>;
export declare const subscriptionTargetOnlySchema: z.ZodEffects<z.ZodObject<{
    topicId: z.ZodOptional<z.ZodString>;
    postId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    topicId?: string | undefined;
    postId?: string | undefined;
}, {
    topicId?: string | undefined;
    postId?: string | undefined;
}>, {
    topicId?: string | undefined;
    postId?: string | undefined;
}, {
    topicId?: string | undefined;
    postId?: string | undefined;
}>;
export declare const digestTriggerSchema: z.ZodObject<{
    sinceHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sinceHours?: number | undefined;
}, {
    sinceHours?: number | undefined;
}>;
//# sourceMappingURL=community.validation.d.ts.map