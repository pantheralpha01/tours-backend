"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock("../community.service", () => ({
    communityService: {
        createTopic: vitest_1.vi.fn(),
        listTopics: vitest_1.vi.fn(),
        updateTopic: vitest_1.vi.fn(),
        createPost: vitest_1.vi.fn(),
        listPosts: vitest_1.vi.fn(),
        getFeed: vitest_1.vi.fn(),
        getPost: vitest_1.vi.fn(),
        updatePost: vitest_1.vi.fn(),
        deletePost: vitest_1.vi.fn(),
        flagPost: vitest_1.vi.fn(),
        moderatePost: vitest_1.vi.fn(),
        reactToPost: vitest_1.vi.fn(),
        addComment: vitest_1.vi.fn(),
        listComments: vitest_1.vi.fn(),
        listSubscriptions: vitest_1.vi.fn(),
        subscribe: vitest_1.vi.fn(),
        unsubscribe: vitest_1.vi.fn(),
        sendDigest: vitest_1.vi.fn(),
    },
}));
const community_controller_1 = require("../community.controller");
const community_service_1 = require("../community.service");
(0, vitest_1.describe)("communityController", () => {
    const service = vitest_1.vi.mocked(community_service_1.communityService);
    const createResponse = () => {
        const res = {};
        res.status = vitest_1.vi.fn().mockReturnValue(res);
        res.json = vitest_1.vi.fn().mockReturnValue(res);
        res.send = vitest_1.vi.fn().mockReturnValue(res);
        return res;
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("createPost", () => {
        (0, vitest_1.it)("attaches the authenticated user as the author", async () => {
            const req = {
                body: { title: "Hello", content: "World content goes here" },
                user: { id: "user-1", role: "AGENT" },
            };
            const res = createResponse();
            service.createPost.mockResolvedValue({ id: "post-1" });
            await community_controller_1.communityController.createPost(req, res);
            (0, vitest_1.expect)(service.createPost).toHaveBeenCalledWith({
                title: "Hello",
                content: "World content goes here",
                authorId: "user-1",
            });
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ id: "post-1" });
        });
        (0, vitest_1.it)("rejects unauthenticated requests", async () => {
            const req = {
                body: { title: "Hello", content: "content that is long enough" },
                user: undefined,
            };
            const res = createResponse();
            await (0, vitest_1.expect)(community_controller_1.communityController.createPost(req, res)).rejects.toThrow("Authentication required");
            (0, vitest_1.expect)(service.createPost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getFeed", () => {
        (0, vitest_1.it)("passes viewer context into the service layer", async () => {
            const req = {
                query: { page: "2", search: "tips" },
                user: { id: "viewer-1", role: "AGENT" },
            };
            const res = createResponse();
            const feed = { data: [], meta: { total: 0, page: 2, limit: 10, totalPages: 0 } };
            service.getFeed.mockResolvedValue(feed);
            await community_controller_1.communityController.getFeed(req, res);
            (0, vitest_1.expect)(service.getFeed).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 10, search: "tips" }), { id: "viewer-1", role: "AGENT" });
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(feed);
        });
    });
    (0, vitest_1.describe)("flagPost", () => {
        (0, vitest_1.it)("enforces authentication before flagging", async () => {
            const req = {
                params: { id: "post-flag" },
                body: { reason: "spam" },
            };
            const res = createResponse();
            await (0, vitest_1.expect)(community_controller_1.communityController.flagPost(req, res)).rejects.toThrow("Authentication required");
            (0, vitest_1.expect)(service.flagPost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("listComments", () => {
        (0, vitest_1.it)("checks post visibility before returning comments", async () => {
            const req = {
                params: { id: "550e8400-e29b-41d4-a716-446655440000" },
                user: { id: "user-11", role: "ADMIN" },
            };
            const res = createResponse();
            service.getPost.mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000" });
            service.listComments.mockResolvedValue([{ id: "comment-1" }]);
            await community_controller_1.communityController.listComments(req, res);
            (0, vitest_1.expect)(service.getPost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", { id: "user-11", role: "ADMIN" });
            (0, vitest_1.expect)(service.listComments).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([{ id: "comment-1" }]);
        });
    });
    (0, vitest_1.describe)("subscriptions", () => {
        (0, vitest_1.it)("lists subscriptions for the authenticated user", async () => {
            const req = { user: { id: "user-2" } };
            const res = createResponse();
            service.listSubscriptions.mockResolvedValue([{ id: "sub-1" }]);
            await community_controller_1.communityController.listSubscriptions(req, res);
            (0, vitest_1.expect)(service.listSubscriptions).toHaveBeenCalledWith({ id: "user-2" });
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([{ id: "sub-1" }]);
        });
        (0, vitest_1.it)("creates a subscription via the service", async () => {
            const req = {
                body: { topicId: "550e8400-e29b-41d4-a716-446655440000" },
                user: { id: "user-2", role: "AGENT" },
            };
            const res = createResponse();
            service.subscribe.mockResolvedValue({ id: "sub-1" });
            await community_controller_1.communityController.subscribe(req, res);
            (0, vitest_1.expect)(service.subscribe).toHaveBeenCalledWith({ topicId: "550e8400-e29b-41d4-a716-446655440000" }, { id: "user-2", role: "AGENT" });
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
        });
        (0, vitest_1.it)("removes subscriptions through the service", async () => {
            const req = {
                body: { topicId: "550e8400-e29b-41d4-a716-446655440000" },
                user: { id: "user-2" },
            };
            const res = createResponse();
            service.unsubscribe.mockResolvedValue({ success: true });
            await community_controller_1.communityController.unsubscribe(req, res);
            (0, vitest_1.expect)(service.unsubscribe).toHaveBeenCalledWith({ topicId: "550e8400-e29b-41d4-a716-446655440000" }, { id: "user-2" });
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ success: true });
        });
    });
    (0, vitest_1.describe)("digest", () => {
        (0, vitest_1.it)("passes body parameters into sendDigest", async () => {
            const req = {
                body: { sinceHours: 12 },
                user: { id: "admin-1", role: "ADMIN" },
            };
            const res = createResponse();
            service.sendDigest.mockResolvedValue({ scheduled: 3 });
            await community_controller_1.communityController.sendDigest(req, res);
            (0, vitest_1.expect)(service.sendDigest).toHaveBeenCalledWith({ sinceHours: 12 }, { id: "admin-1", role: "ADMIN" });
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(202);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ scheduled: 3 });
        });
    });
});
//# sourceMappingURL=community.controller.spec.js.map