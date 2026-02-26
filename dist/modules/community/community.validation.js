"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digestTriggerSchema = exports.subscriptionTargetOnlySchema = exports.subscriptionSchema = exports.moderatePostSchema = exports.flagPostSchema = exports.feedQuerySchema = exports.commentIdParamSchema = exports.commentSchema = exports.reactionSchema = exports.postIdParamSchema = exports.listPostsSchema = exports.updatePostSchema = exports.createPostSchema = exports.topicIdParamSchema = exports.listTopicsSchema = exports.updateTopicSchema = exports.createTopicSchema = exports.communitySubscriptionFrequencyEnum = exports.communityReactionEnum = exports.communityVisibilityEnum = exports.communityPostStatusEnum = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.communityPostStatusEnum = zod_1.z.enum(["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]);
exports.communityVisibilityEnum = zod_1.z.enum(["PUBLIC", "MEMBERS_ONLY"]);
exports.communityReactionEnum = zod_1.z.enum(["LIKE", "LOVE", "INSIGHTFUL", "CURIOUS"]);
exports.communitySubscriptionFrequencyEnum = zod_1.z.enum(["INSTANT", "DAILY"]);
exports.createTopicSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    slug: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().max(500).optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updateTopicSchema = exports.createTopicSchema.partial();
exports.listTopicsSchema = pagination_1.paginationSchema.extend({
    search: zod_1.z.string().optional(),
});
exports.topicIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
const basePostSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(10),
    excerpt: zod_1.z.string().max(500).optional(),
    coverImage: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string().min(2)).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    topicId: zod_1.z.string().uuid().optional(),
    status: exports.communityPostStatusEnum.optional(),
    visibility: exports.communityVisibilityEnum.optional(),
    isPinned: zod_1.z.boolean().optional(),
});
exports.createPostSchema = basePostSchema;
exports.updatePostSchema = basePostSchema.partial().extend({
    topicId: zod_1.z.string().uuid().nullable().optional(),
});
exports.listPostsSchema = pagination_1.paginationSchema.extend({
    status: exports.communityPostStatusEnum.optional(),
    visibility: exports.communityVisibilityEnum.optional(),
    topicId: zod_1.z.string().uuid().optional(),
    authorId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
});
exports.postIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.reactionSchema = zod_1.z.object({
    type: exports.communityReactionEnum.optional(),
});
exports.commentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    parentId: zod_1.z.string().uuid().optional(),
});
exports.commentIdParamSchema = zod_1.z.object({
    commentId: zod_1.z.string().uuid(),
});
exports.feedQuerySchema = exports.listPostsSchema.extend({
    tags: zod_1.z.array(zod_1.z.string().min(2)).optional(),
});
exports.flagPostSchema = zod_1.z.object({
    reason: zod_1.z.string().max(500).optional(),
});
exports.moderatePostSchema = zod_1.z.object({
    status: exports.communityPostStatusEnum,
    visibility: exports.communityVisibilityEnum.optional(),
    isPinned: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
const subscriptionTargetSchema = zod_1.z.object({
    topicId: zod_1.z.string().uuid().optional(),
    postId: zod_1.z.string().uuid().optional(),
});
exports.subscriptionSchema = subscriptionTargetSchema.extend({
    frequency: exports.communitySubscriptionFrequencyEnum.optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
}).refine((value) => Boolean(value.topicId) !== Boolean(value.postId), {
    message: "Provide either topicId or postId",
    path: ["topicId"],
});
exports.subscriptionTargetOnlySchema = subscriptionTargetSchema.refine((value) => Boolean(value.topicId) !== Boolean(value.postId), {
    message: "Provide either topicId or postId",
    path: ["topicId"],
});
exports.digestTriggerSchema = zod_1.z.object({
    sinceHours: zod_1.z.coerce.number().min(1).max(168).optional(),
});
//# sourceMappingURL=community.validation.js.map