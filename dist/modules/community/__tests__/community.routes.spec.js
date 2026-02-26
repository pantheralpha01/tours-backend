"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const vitest_1 = require("vitest");
const errorHandler_1 = require("../../../middleware/errorHandler");
const notFound_1 = require("../../../middleware/notFound");
const community_routes_1 = require("../community.routes");
const community_service_1 = require("../community.service");
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
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/community", community_routes_1.communityRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(community_service_1.communityService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("communityRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("lists topics", async () => {
        service.listTopics.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app).get("/api/community/topics");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.listTopics).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 1, limit: 10 }));
    });
    (0, vitest_1.it)("creates a topic", async () => {
        service.createTopic.mockResolvedValue({ id: "topic-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/topics")
            .send({ name: "Announcements" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toEqual({ id: "topic-1" });
        (0, vitest_1.expect)(service.createTopic).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ name: "Announcements", actorId: "test-user" }));
    });
    (0, vitest_1.it)("updates a topic", async () => {
        service.updateTopic.mockResolvedValue({ id: "topic-1", name: "Ops" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/community/topics/550e8400-e29b-41d4-a716-446655440000")
            .send({ name: "Ops" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.updateTopic).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ name: "Ops" }));
    });
    (0, vitest_1.it)("creates a post", async () => {
        service.createPost.mockResolvedValue({ id: "post-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/posts")
            .send({ title: "Hello", content: "This is valid content." });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.createPost).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ title: "Hello", authorId: "test-user" }));
    });
    (0, vitest_1.it)("lists posts", async () => {
        service.listPosts.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app).get("/api/community/posts");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.listPosts).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 1, limit: 10 }));
    });
    (0, vitest_1.it)("provides feed results", async () => {
        service.getFeed.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app).get("/api/community/feed");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.getFeed).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 1, limit: 10 }), { id: "test-user", role: "ADMIN" });
    });
    (0, vitest_1.it)("returns a single post", async () => {
        service.getPost.mockResolvedValue({ id: "post-1" });
        const res = await (0, supertest_1.default)(app).get("/api/community/posts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "post-1" });
    });
    (0, vitest_1.it)("updates a post", async () => {
        service.updatePost.mockResolvedValue({ id: "post-1", title: "Updated" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/community/posts/550e8400-e29b-41d4-a716-446655440000")
            .send({ title: "Updated" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.updatePost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ title: "Updated" }), { id: "test-user", role: "ADMIN" });
    });
    (0, vitest_1.it)("deletes a post", async () => {
        service.deletePost.mockResolvedValue({ success: true });
        const res = await (0, supertest_1.default)(app).delete("/api/community/posts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.deletePost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", { id: "test-user", role: "ADMIN" });
    });
    (0, vitest_1.it)("flags a post", async () => {
        service.flagPost.mockResolvedValue({ id: "post-1", status: "FLAGGED" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/flag")
            .send({ reason: "spam" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.flagPost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ actorId: "test-user", reason: "spam" }));
    });
    (0, vitest_1.it)("moderates a post", async () => {
        service.moderatePost.mockResolvedValue({ id: "post-1", status: "PUBLISHED" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/moderate")
            .send({ status: "PUBLISHED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.moderatePost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "PUBLISHED" }), { id: "test-user", role: "ADMIN" });
    });
    (0, vitest_1.it)("reacts to a post", async () => {
        service.reactToPost.mockResolvedValue({ action: "added", count: 1 });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/react")
            .send({ type: "LOVE" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ action: "added", count: 1 });
        (0, vitest_1.expect)(service.reactToPost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ userId: "test-user", type: "LOVE" }));
    });
    (0, vitest_1.it)("adds a comment", async () => {
        service.addComment.mockResolvedValue({ id: "comment-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/comments")
            .send({ content: "Great" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.addComment).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ userId: "test-user", content: "Great" }));
    });
    (0, vitest_1.it)("lists comments", async () => {
        service.getPost.mockResolvedValue({ id: "post-1" });
        service.listComments.mockResolvedValue([{ id: "comment-1" }]);
        const res = await (0, supertest_1.default)(app).get("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/comments");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual([{ id: "comment-1" }]);
        (0, vitest_1.expect)(service.listComments).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("lists subscriptions", async () => {
        service.listSubscriptions.mockResolvedValue([{ id: "sub-1" }]);
        const res = await (0, supertest_1.default)(app).get("/api/community/subscriptions");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual([{ id: "sub-1" }]);
        (0, vitest_1.expect)(service.listSubscriptions).toHaveBeenCalledWith({ id: "test-user" });
    });
    (0, vitest_1.it)("creates a subscription", async () => {
        service.subscribe.mockResolvedValue({ id: "sub-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/subscriptions")
            .send({ topicId: "550e8400-e29b-41d4-a716-446655440000" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.subscribe).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ topicId: "550e8400-e29b-41d4-a716-446655440000" }), vitest_1.expect.objectContaining({ id: "test-user" }));
    });
    (0, vitest_1.it)("removes a subscription", async () => {
        service.unsubscribe.mockResolvedValue({ success: true });
        const res = await (0, supertest_1.default)(app)
            .delete("/api/community/subscriptions")
            .send({ topicId: "550e8400-e29b-41d4-a716-446655440000" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ success: true });
        (0, vitest_1.expect)(service.unsubscribe).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ topicId: "550e8400-e29b-41d4-a716-446655440000" }), { id: "test-user" });
    });
    (0, vitest_1.it)("triggers a digest", async () => {
        const now = new Date();
        service.sendDigest.mockResolvedValue({ scheduled: 2, since: now });
        const res = await (0, supertest_1.default)(app)
            .post("/api/community/digest/send")
            .send({ sinceHours: 12 });
        (0, vitest_1.expect)(res.status).toBe(202);
        (0, vitest_1.expect)(service.sendDigest).toHaveBeenCalledWith({ sinceHours: 12 }, { id: "test-user", role: "ADMIN" });
        (0, vitest_1.expect)(res.body).toEqual({ scheduled: 2, since: now.toISOString() });
    });
});
//# sourceMappingURL=community.routes.spec.js.map