import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const communityPostStatusEnum = z.enum(["DRAFT", "PUBLISHED", "FLAGGED", "ARCHIVED"]);
export const communityVisibilityEnum = z.enum(["PUBLIC", "MEMBERS_ONLY"]);
export const communityReactionEnum = z.enum(["LIKE", "LOVE", "INSIGHTFUL", "CURIOUS"]);
export const communitySubscriptionFrequencyEnum = z.enum(["INSTANT", "DAILY"]);

export const createTopicSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateTopicSchema = createTopicSchema.partial();

export const listTopicsSchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const topicIdParamSchema = z.object({
  id: z.string().uuid(),
});

const basePostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string().min(2)).optional(),
  metadata: z.record(z.any()).optional(),
  topicId: z.string().uuid().optional(),
  status: communityPostStatusEnum.optional(),
  visibility: communityVisibilityEnum.optional(),
  isPinned: z.boolean().optional(),
});

export const createPostSchema = basePostSchema;

export const updatePostSchema = basePostSchema.partial().extend({
  topicId: z.string().uuid().nullable().optional(),
});

export const listPostsSchema = paginationSchema.extend({
  status: communityPostStatusEnum.optional(),
  visibility: communityVisibilityEnum.optional(),
  topicId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const postIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const reactionSchema = z.object({
  type: communityReactionEnum.optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

export const commentIdParamSchema = z.object({
  commentId: z.string().uuid(),
});

export const feedQuerySchema = listPostsSchema.extend({
  tags: z.array(z.string().min(2)).optional(),
});

export const flagPostSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const moderatePostSchema = z.object({
  status: communityPostStatusEnum,
  visibility: communityVisibilityEnum.optional(),
  isPinned: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

const subscriptionTargetSchema = z.object({
  topicId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
});

export const subscriptionSchema = subscriptionTargetSchema.extend({
  frequency: communitySubscriptionFrequencyEnum.optional(),
  metadata: z.record(z.any()).optional(),
}).refine((value) => Boolean(value.topicId) !== Boolean(value.postId), {
  message: "Provide either topicId or postId",
  path: ["topicId"],
});

export const subscriptionTargetOnlySchema = subscriptionTargetSchema.refine(
  (value) => Boolean(value.topicId) !== Boolean(value.postId),
  {
    message: "Provide either topicId or postId",
    path: ["topicId"],
  }
);

export const digestTriggerSchema = z.object({
  sinceHours: z.coerce.number().min(1).max(168).optional(),
});
