import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { communityController } from "../community.controller";
import { communityService } from "../community.service";

describe("communityController", () => {
  const service = vi.mocked(communityService);

  const createResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPost", () => {
    it("attaches the authenticated user as the author", async () => {
      const req: any = {
        body: { title: "Hello", content: "World content goes here" },
        user: { id: "user-1", role: "AGENT" },
      };
      const res = createResponse();
      service.createPost.mockResolvedValue({ id: "post-1" } as any);

      await communityController.createPost(req, res);

      expect(service.createPost).toHaveBeenCalledWith({
        title: "Hello",
        content: "World content goes here",
        authorId: "user-1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "post-1" });
    });

    it("rejects unauthenticated requests", async () => {
      const req: any = {
        body: { title: "Hello", content: "content that is long enough" },
        user: undefined,
      };
      const res = createResponse();

      await expect(communityController.createPost(req, res)).rejects.toThrow("Authentication required");
      expect(service.createPost).not.toHaveBeenCalled();
    });
  });

  describe("getFeed", () => {
    it("passes viewer context into the service layer", async () => {
      const req: any = {
        query: { page: "2", search: "tips" },
        user: { id: "viewer-1", role: "AGENT" },
      };
      const res = createResponse();
      const feed = { data: [], meta: { total: 0, page: 2, limit: 10, totalPages: 0 } };
      service.getFeed.mockResolvedValue(feed as any);

      await communityController.getFeed(req, res);

      expect(service.getFeed).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 10, search: "tips" }),
        { id: "viewer-1", role: "AGENT" }
      );
      expect(res.json).toHaveBeenCalledWith(feed);
    });
  });

  describe("flagPost", () => {
    it("enforces authentication before flagging", async () => {
      const req: any = {
        params: { id: "post-flag" },
        body: { reason: "spam" },
      };
      const res = createResponse();

      await expect(communityController.flagPost(req, res)).rejects.toThrow("Authentication required");
      expect(service.flagPost).not.toHaveBeenCalled();
    });
  });

  describe("listComments", () => {
    it("checks post visibility before returning comments", async () => {
      const req: any = {
        params: { id: "550e8400-e29b-41d4-a716-446655440000" },
        user: { id: "user-11", role: "ADMIN" },
      };
      const res = createResponse();
      service.getPost.mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000" } as any);
      service.listComments.mockResolvedValue([{ id: "comment-1" }] as any);

      await communityController.listComments(req, res);

      expect(service.getPost).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", { id: "user-11", role: "ADMIN" });
      expect(service.listComments).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: "comment-1" }]);
    });
  });

  describe("subscriptions", () => {
    it("lists subscriptions for the authenticated user", async () => {
      const req: any = { user: { id: "user-2" } };
      const res = createResponse();
      service.listSubscriptions.mockResolvedValue([{ id: "sub-1" }] as any);

      await communityController.listSubscriptions(req, res);

      expect(service.listSubscriptions).toHaveBeenCalledWith({ id: "user-2" });
      expect(res.json).toHaveBeenCalledWith([{ id: "sub-1" }]);
    });

    it("creates a subscription via the service", async () => {
      const req: any = {
        body: { topicId: "550e8400-e29b-41d4-a716-446655440000" },
        user: { id: "user-2", role: "AGENT" },
      };
      const res = createResponse();
      service.subscribe.mockResolvedValue({ id: "sub-1" } as any);

      await communityController.subscribe(req, res);

      expect(service.subscribe).toHaveBeenCalledWith(
        { topicId: "550e8400-e29b-41d4-a716-446655440000" },
        { id: "user-2", role: "AGENT" }
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("removes subscriptions through the service", async () => {
      const req: any = {
        body: { topicId: "550e8400-e29b-41d4-a716-446655440000" },
        user: { id: "user-2" },
      };
      const res = createResponse();
      service.unsubscribe.mockResolvedValue({ success: true } as any);

      await communityController.unsubscribe(req, res);

      expect(service.unsubscribe).toHaveBeenCalledWith({ topicId: "550e8400-e29b-41d4-a716-446655440000" }, { id: "user-2" });
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("digest", () => {
    it("passes body parameters into sendDigest", async () => {
      const req: any = {
        body: { sinceHours: 12 },
        user: { id: "admin-1", role: "ADMIN" },
      };
      const res = createResponse();
      service.sendDigest.mockResolvedValue({ scheduled: 3 } as any);

      await communityController.sendDigest(req, res);

      expect(service.sendDigest).toHaveBeenCalledWith(
        { sinceHours: 12 },
        { id: "admin-1", role: "ADMIN" }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ scheduled: 3 });
    });
  });
});
