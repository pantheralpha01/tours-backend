import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { communityRoutes } from "../community.routes";
import { communityService } from "../community.service";

vi.mock("../community.service", () => ({
  communityService: {
    createTopic: vi.fn(),
    listTopics: vi.fn(),
    updateTopic: vi.fn(),
    createPost: vi.fn(),
    listPosts: vi.fn(),
    getFeed: vi.fn(),
    getPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    flagPost: vi.fn(),
    moderatePost: vi.fn(),
    reactToPost: vi.fn(),
    addComment: vi.fn(),
    listComments: vi.fn(),
    listSubscriptions: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    sendDigest: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/community", communityRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(communityService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("communityRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists topics", async () => {
    service.listTopics.mockResolvedValue(paginatedResponse as any);

    const res = await request(app).get("/api/community/topics");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.listTopics).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 })
    );
  });

  it("creates a topic", async () => {
    service.createTopic.mockResolvedValue({ id: "topic-1" } as any);

    const res = await request(app)
      .post("/api/community/topics")
      .send({ name: "Announcements" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "topic-1" });
    expect(service.createTopic).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Announcements", actorId: "test-user" })
    );
  });

  it("updates a topic", async () => {
    service.updateTopic.mockResolvedValue({ id: "topic-1", name: "Ops" } as any);

    const res = await request(app)
      .patch("/api/community/topics/550e8400-e29b-41d4-a716-446655440000")
      .send({ name: "Ops" });

    expect(res.status).toBe(200);
    expect(service.updateTopic).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ name: "Ops" })
    );
  });

  it("creates a post", async () => {
    service.createPost.mockResolvedValue({ id: "post-1" } as any);

    const res = await request(app)
      .post("/api/community/posts")
      .send({ title: "Hello", content: "This is valid content." });

    expect(res.status).toBe(201);
    expect(service.createPost).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Hello", authorId: "test-user" })
    );
  });

  it("lists posts", async () => {
    service.listPosts.mockResolvedValue(paginatedResponse as any);

    const res = await request(app).get("/api/community/posts");

    expect(res.status).toBe(200);
    expect(service.listPosts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 })
    );
  });

  it("provides feed results", async () => {
    service.getFeed.mockResolvedValue(paginatedResponse as any);

    const res = await request(app).get("/api/community/feed");

    expect(res.status).toBe(200);
    expect(service.getFeed).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
      { id: "test-user", role: "ADMIN" }
    );
  });

  it("returns a single post", async () => {
    service.getPost.mockResolvedValue({ id: "post-1" } as any);

    const res = await request(app).get("/api/community/posts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "post-1" });
  });

  it("updates a post", async () => {
    service.updatePost.mockResolvedValue({ id: "post-1", title: "Updated" } as any);

    const res = await request(app)
      .patch("/api/community/posts/550e8400-e29b-41d4-a716-446655440000")
      .send({ title: "Updated" });

    expect(res.status).toBe(200);
    expect(service.updatePost).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ title: "Updated" }),
      { id: "test-user", role: "ADMIN" }
    );
  });

  it("deletes a post", async () => {
    service.deletePost.mockResolvedValue({ success: true } as any);

    const res = await request(app).delete("/api/community/posts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.deletePost).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      { id: "test-user", role: "ADMIN" }
    );
  });

  it("flags a post", async () => {
    service.flagPost.mockResolvedValue({ id: "post-1", status: "FLAGGED" } as any);

    const res = await request(app)
      .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/flag")
      .send({ reason: "spam" });

    expect(res.status).toBe(200);
    expect(service.flagPost).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ actorId: "test-user", reason: "spam" })
    );
  });

  it("moderates a post", async () => {
    service.moderatePost.mockResolvedValue({ id: "post-1", status: "PUBLISHED" } as any);

    const res = await request(app)
      .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/moderate")
      .send({ status: "PUBLISHED" });

    expect(res.status).toBe(200);
    expect(service.moderatePost).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "PUBLISHED" }),
      { id: "test-user", role: "ADMIN" }
    );
  });

  it("reacts to a post", async () => {
    service.reactToPost.mockResolvedValue({ action: "added", count: 1 } as any);

    const res = await request(app)
      .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/react")
      .send({ type: "LOVE" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ action: "added", count: 1 });
    expect(service.reactToPost).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ userId: "test-user", type: "LOVE" })
    );
  });

  it("adds a comment", async () => {
    service.addComment.mockResolvedValue({ id: "comment-1" } as any);

    const res = await request(app)
      .post("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/comments")
      .send({ content: "Great" });

    expect(res.status).toBe(201);
    expect(service.addComment).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ userId: "test-user", content: "Great" })
    );
  });

  it("lists comments", async () => {
    service.getPost.mockResolvedValue({ id: "post-1" } as any);
    service.listComments.mockResolvedValue([{ id: "comment-1" }] as any);

    const res = await request(app).get("/api/community/posts/550e8400-e29b-41d4-a716-446655440000/comments");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "comment-1" }]);
    expect(service.listComments).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("lists subscriptions", async () => {
    service.listSubscriptions.mockResolvedValue([{ id: "sub-1" }] as any);

    const res = await request(app).get("/api/community/subscriptions");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "sub-1" }]);
    expect(service.listSubscriptions).toHaveBeenCalledWith({ id: "test-user" });
  });

  it("creates a subscription", async () => {
    service.subscribe.mockResolvedValue({ id: "sub-1" } as any);

    const res = await request(app)
      .post("/api/community/subscriptions")
      .send({ topicId: "550e8400-e29b-41d4-a716-446655440000" });

    expect(res.status).toBe(201);
    expect(service.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({ topicId: "550e8400-e29b-41d4-a716-446655440000" }),
      expect.objectContaining({ id: "test-user" })
    );
  });

  it("removes a subscription", async () => {
    service.unsubscribe.mockResolvedValue({ success: true } as any);

    const res = await request(app)
      .delete("/api/community/subscriptions")
      .send({ topicId: "550e8400-e29b-41d4-a716-446655440000" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(service.unsubscribe).toHaveBeenCalledWith(
      expect.objectContaining({ topicId: "550e8400-e29b-41d4-a716-446655440000" }),
      { id: "test-user" }
    );
  });

  it("triggers a digest", async () => {
    const now = new Date();
    service.sendDigest.mockResolvedValue({ scheduled: 2, since: now } as any);

    const res = await request(app)
      .post("/api/community/digest/send")
      .send({ sinceHours: 12 });

    expect(res.status).toBe(202);
    expect(service.sendDigest).toHaveBeenCalledWith(
      { sinceHours: 12 },
      { id: "test-user", role: "ADMIN" }
    );
    expect(res.body).toEqual({ scheduled: 2, since: now.toISOString() });
  });
});
