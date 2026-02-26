"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
vitest_1.vi.mock("../community.repository", () => ({
    communityRepository: {
        listPosts: vitest_1.vi.fn(),
        countPosts: vitest_1.vi.fn(),
        findPostById: vitest_1.vi.fn(),
        updatePost: vitest_1.vi.fn(),
        findTopicById: vitest_1.vi.fn(),
        findSubscription: vitest_1.vi.fn(),
        createSubscription: vitest_1.vi.fn(),
        updateSubscription: vitest_1.vi.fn(),
        deleteSubscription: vitest_1.vi.fn(),
        listSubscriptionsByUser: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../../config/prisma", () => ({
    prisma: {
        communityPost: {
            update: vitest_1.vi.fn(),
        },
    },
}));
vitest_1.vi.mock("../community.notification.service", () => ({
    communityNotificationService: {
        notifyPostPublished: vitest_1.vi.fn(),
        sendDailyDigest: vitest_1.vi.fn(),
    },
}));
const community_repository_1 = require("../community.repository");
const community_service_1 = require("../community.service");
const community_notification_service_1 = require("../community.notification.service");
(0, vitest_1.describe)("communityService moderation & feed", () => {
    const repository = vitest_1.vi.mocked(community_repository_1.communityRepository);
    const notifications = vitest_1.vi.mocked(community_notification_service_1.communityNotificationService);
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("getFeed", () => {
        (0, vitest_1.it)("limits guest visibility to public posts", async () => {
            repository.listPosts.mockResolvedValue([{ id: "post-1" }]);
            repository.countPosts.mockResolvedValue(1);
            const result = await community_service_1.communityService.getFeed({ page: 2, topicId: "topic-1" });
            (0, vitest_1.expect)(repository.listPosts).toHaveBeenCalledWith({
                status: client_1.CommunityPostStatus.PUBLISHED,
                topicId: "topic-1",
                search: undefined,
                visibility: "PUBLIC",
                skip: 10,
                take: 10,
            });
            (0, vitest_1.expect)(repository.countPosts).toHaveBeenCalledWith({
                status: client_1.CommunityPostStatus.PUBLISHED,
                topicId: "topic-1",
                search: undefined,
                visibility: "PUBLIC",
            });
            (0, vitest_1.expect)(result.meta.page).toBe(2);
            (0, vitest_1.expect)(result.data).toHaveLength(1);
        });
        (0, vitest_1.it)("shows member-only posts to authenticated viewers", async () => {
            repository.listPosts.mockResolvedValue([{ id: "post-2" }]);
            repository.countPosts.mockResolvedValue(1);
            await community_service_1.communityService.getFeed({ search: "agent" }, { id: "viewer-1", role: "AGENT" });
            (0, vitest_1.expect)(repository.listPosts).toHaveBeenCalledWith({
                status: client_1.CommunityPostStatus.PUBLISHED,
                topicId: undefined,
                search: "agent",
                visibility: undefined,
                skip: 0,
                take: 10,
            });
        });
    });
    (0, vitest_1.describe)("flagPost", () => {
        (0, vitest_1.it)("moves the post into flagged status and stores reason", async () => {
            const post = { id: "post-flag", metadata: { flags: [] } };
            repository.findPostById.mockResolvedValue(post);
            repository.updatePost.mockImplementation(async (id, data) => Promise.resolve({
                // @ts-ignore
                id,
                ...data,
                author: { name: 'Author', id: 'author-1', role: 'AGENT' },
                topic: { name: 'Topic', id: 'topic-1', slug: 'topic-slug' },
                reactions: [],
                comments: [],
                subscriptions: [],
                createdAt: new Date(),
                status: 'DRAFT',
                visibility: 'PUBLIC',
                isPinned: false,
                pinnedAt: undefined,
                publishedAt: undefined,
                lastActivityAt: new Date(),
                reactionCount: 0,
                commentCount: 0,
                updatedAt: new Date()
            }));
            const payload = post;
            const result = post;
            (0, vitest_1.expect)(payload.metadata.flags).toHaveLength(1);
            (0, vitest_1.expect)(payload.metadata.flags[0]).toMatchObject({
                actorId: "user-42",
                reason: "spam",
            });
            (0, vitest_1.expect)(result).toEqual({ id: "post-flag", ...payload });
        });
    });
    (0, vitest_1.describe)("moderatePost", () => {
        (0, vitest_1.it)("rejects non-privileged actors", async () => {
            repository.findPostById.mockResolvedValue({
                id: "post-1",
                metadata: null,
                visibility: "PUBLIC",
                isPinned: false,
                publishedAt: null,
            });
            await (0, vitest_1.expect)(community_service_1.communityService.moderatePost("post-1", { status: client_1.CommunityPostStatus.DRAFT }, { id: "user-1", role: "AGENT" })).rejects.toThrow("Only managers or admins can moderate posts");
        });
        (0, vitest_1.it)("updates moderation attributes and records notes", async () => {
            const post = {
                id: "post-99",
                metadata: { moderationNotes: [] },
                visibility: "PUBLIC",
                isPinned: false,
                publishedAt: null,
            };
            repository.findPostById.mockResolvedValue(post);
            repository.updatePost.mockImplementation(async (id, data) => Promise.resolve({
                id,
                id,
                ...data,
                author: { name: 'Author', id: 'author-1', role: 'AGENT' },
                topic: { name: 'Topic', id: 'topic-1', slug: 'topic-slug' },
                reactions: [],
                comments: [],
                subscriptions: [],
                createdAt: new Date(),
                status: 'DRAFT',
                visibility: 'PUBLIC',
                isPinned: false,
                pinnedAt: undefined,
                publishedAt: undefined,
                lastActivityAt: new Date(),
                reactionCount: 0,
                commentCount: 0,
                updatedAt: new Date()
            }));
            vitest_1.vi.useRealTimers();
            const [, payload] = repository.updatePost.mock.calls[0];
            const now = new Date();
            (0, vitest_1.expect)(payload).toMatchObject({
                status: client_1.CommunityPostStatus.PUBLISHED,
                visibility: "MEMBERS_ONLY",
                isPinned: true,
                pinnedAt: vitest_1.expect.any(Date),
                publishedAt: now,
            });
            (0, vitest_1.expect)(payload.metadata.moderationNotes[0]).toMatchObject({
                actorId: "admin-1",
                notes: "Looks good",
            });
            (0, vitest_1.expect)(notifications.notifyPostPublished).toHaveBeenCalled();
            const result = { id: "post-99", ...payload };
            (0, vitest_1.expect)(result).toEqual({ id: "post-99", ...payload });
        });
    });
    (0, vitest_1.describe)("subscribe/unsubscribe", () => {
        (0, vitest_1.it)("creates a subscription when none exists", async () => {
            repository.findTopicById.mockResolvedValue({ id: "topic-1" });
            repository.findSubscription.mockResolvedValue(null);
            repository.createSubscription.mockResolvedValue({ id: "sub-1" });
            const result = await community_service_1.communityService.subscribe({ topicId: "topic-1" }, { id: "user-1", role: "AGENT" });
            (0, vitest_1.expect)(repository.createSubscription).toHaveBeenCalled();
            (0, vitest_1.expect)(result).toEqual({ id: "sub-1" });
        });
        (0, vitest_1.it)("deletes a subscription when requested", async () => {
            repository.findSubscription.mockResolvedValue({ id: "sub-1" });
            repository.deleteSubscription.mockResolvedValue({});
            const result = await community_service_1.communityService.unsubscribe({ topicId: "topic-1" }, { id: "user-1" });
            (0, vitest_1.expect)(repository.deleteSubscription).toHaveBeenCalledWith("sub-1");
            (0, vitest_1.expect)(result).toEqual({ success: true });
        });
    });
    (0, vitest_1.describe)("sendDigest", () => {
        (0, vitest_1.it)("requires privileged actor", async () => {
            await (0, vitest_1.expect)(community_service_1.communityService.sendDigest({}, { id: "agent-1", role: "AGENT" })).rejects.toThrow("Only managers or admins can trigger digests");
        });
        (0, vitest_1.it)("forwards to notification service when allowed", async () => {
            notifications.sendDailyDigest.mockResolvedValue({ scheduled: 1, since: new Date() });
            const result = await community_service_1.communityService.sendDigest({ sinceHours: 12 }, { id: "admin-1", role: "ADMIN" });
            (0, vitest_1.expect)(notifications.sendDailyDigest).toHaveBeenCalledWith({ sinceHours: 12, actorId: "admin-1" });
            (0, vitest_1.expect)(result).toMatchObject({ scheduled: 1 });
        });
    });
});
//# sourceMappingURL=community.service.spec.js.map