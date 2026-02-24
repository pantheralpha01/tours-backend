import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommunityPostStatus } from "@prisma/client";

vi.mock("../community.repository", () => ({
  communityRepository: {
    listPosts: vi.fn(),
    countPosts: vi.fn(),
    findPostById: vi.fn(),
    updatePost: vi.fn(),
    findTopicById: vi.fn(),
    findSubscription: vi.fn(),
    createSubscription: vi.fn(),
    updateSubscription: vi.fn(),
    deleteSubscription: vi.fn(),
    listSubscriptionsByUser: vi.fn(),
  },
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    communityPost: {
      update: vi.fn(),
    },
  },
}));

vi.mock("../community.notification.service", () => ({
  communityNotificationService: {
    notifyPostPublished: vi.fn(),
    sendDailyDigest: vi.fn(),
  },
}));

import { communityRepository } from "../community.repository";
import { communityService } from "../community.service";
import { communityNotificationService } from "../community.notification.service";

describe("communityService moderation & feed", () => {
  const repository = vi.mocked(communityRepository);
  const notifications = vi.mocked(communityNotificationService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFeed", () => {
    it("limits guest visibility to public posts", async () => {
      repository.listPosts.mockResolvedValue([{ id: "post-1" }] as any);
      repository.countPosts.mockResolvedValue(1 as any);

      const result = await communityService.getFeed({ page: 2, topicId: "topic-1" });

      expect(repository.listPosts).toHaveBeenCalledWith({
        status: CommunityPostStatus.PUBLISHED,
        topicId: "topic-1",
        search: undefined,
        visibility: "PUBLIC",
        skip: 10,
        take: 10,
      });
      expect(repository.countPosts).toHaveBeenCalledWith({
        status: CommunityPostStatus.PUBLISHED,
        topicId: "topic-1",
        search: undefined,
        visibility: "PUBLIC",
      });
      expect(result.meta.page).toBe(2);
      expect(result.data).toHaveLength(1);
    });

    it("shows member-only posts to authenticated viewers", async () => {
      repository.listPosts.mockResolvedValue([{ id: "post-2" }] as any);
      repository.countPosts.mockResolvedValue(1 as any);

      await communityService.getFeed({ search: "agent" }, { id: "viewer-1", role: "AGENT" as any });

      expect(repository.listPosts).toHaveBeenCalledWith({
        status: CommunityPostStatus.PUBLISHED,
        topicId: undefined,
        search: "agent",
        visibility: undefined,
        skip: 0,
        take: 10,
      });
    });
  });

  describe("flagPost", () => {
    it("moves the post into flagged status and stores reason", async () => {
      const post = { id: "post-flag", metadata: { flags: [] } } as any;
      repository.findPostById.mockResolvedValue(post);
      repository.updatePost.mockImplementation(async (id, data) => ({ id, ...data } as any));

      const result = await communityService.flagPost("post-flag", {
        actorId: "user-42",
        reason: "spam",
      });

      expect(repository.updatePost).toHaveBeenCalledWith(
        "post-flag",
        expect.objectContaining({ status: CommunityPostStatus.FLAGGED })
      );
      const [, payload] = repository.updatePost.mock.calls[0];
      expect((payload as any).metadata.flags).toHaveLength(1);
      expect((payload as any).metadata.flags[0]).toMatchObject({
        actorId: "user-42",
        reason: "spam",
      });
      expect(result).toEqual({ id: "post-flag", ...payload });
    });
  });

  describe("moderatePost", () => {
    it("rejects non-privileged actors", async () => {
      repository.findPostById.mockResolvedValue({
        id: "post-1",
        metadata: null,
        visibility: "PUBLIC",
        isPinned: false,
        publishedAt: null,
      } as any);

      await expect(
        communityService.moderatePost(
          "post-1",
          { status: CommunityPostStatus.DRAFT },
          { id: "user-1", role: "AGENT" as any }
        )
      ).rejects.toThrow("Only managers or admins can moderate posts");
    });

    it("updates moderation attributes and records notes", async () => {
      const post = {
        id: "post-99",
        metadata: { moderationNotes: [] },
        visibility: "PUBLIC",
        isPinned: false,
        publishedAt: null,
      } as any;
      repository.findPostById.mockResolvedValue(post);
      repository.updatePost.mockImplementation(async (id, data) => ({ id, ...data } as any));
      notifications.notifyPostPublished.mockResolvedValue(1 as any);

      vi.useFakeTimers();
      const now = new Date("2026-02-23T00:00:00.000Z");
      vi.setSystemTime(now);

      const result = await communityService.moderatePost(
        "post-99",
        {
          status: CommunityPostStatus.PUBLISHED,
          visibility: "MEMBERS_ONLY",
          isPinned: true,
          notes: "Looks good",
        },
        { id: "admin-1", role: "ADMIN" as any }
      );

      vi.useRealTimers();

      const [, payload] = repository.updatePost.mock.calls[0];
      expect(payload).toMatchObject({
        status: CommunityPostStatus.PUBLISHED,
        visibility: "MEMBERS_ONLY",
        isPinned: true,
        pinnedAt: expect.any(Date),
        publishedAt: now,
      });
      expect((payload as any).metadata.moderationNotes[0]).toMatchObject({
        actorId: "admin-1",
        notes: "Looks good",
      });
      expect(notifications.notifyPostPublished).toHaveBeenCalled();
      expect(result).toEqual({ id: "post-99", ...payload });
    });
  });

  describe("subscribe/unsubscribe", () => {
    it("creates a subscription when none exists", async () => {
      repository.findTopicById.mockResolvedValue({ id: "topic-1" } as any);
      repository.findSubscription.mockResolvedValue(null as any);
      repository.createSubscription.mockResolvedValue({ id: "sub-1" } as any);

      const result = await communityService.subscribe({ topicId: "topic-1" }, { id: "user-1", role: "AGENT" as any });

      expect(repository.createSubscription).toHaveBeenCalled();
      expect(result).toEqual({ id: "sub-1" });
    });

    it("deletes a subscription when requested", async () => {
      repository.findSubscription.mockResolvedValue({ id: "sub-1" } as any);
      repository.deleteSubscription.mockResolvedValue({} as any);

      const result = await communityService.unsubscribe({ topicId: "topic-1" }, { id: "user-1" });

      expect(repository.deleteSubscription).toHaveBeenCalledWith("sub-1");
      expect(result).toEqual({ success: true });
    });
  });

  describe("sendDigest", () => {
    it("requires privileged actor", async () => {
      await expect(communityService.sendDigest({}, { id: "agent-1", role: "AGENT" as any })).rejects.toThrow(
        "Only managers or admins can trigger digests"
      );
    });

    it("forwards to notification service when allowed", async () => {
      notifications.sendDailyDigest.mockResolvedValue({ scheduled: 1, since: new Date() } as any);

      const result = await communityService.sendDigest({ sinceHours: 12 }, { id: "admin-1", role: "ADMIN" as any });

      expect(notifications.sendDailyDigest).toHaveBeenCalledWith({ sinceHours: 12, actorId: "admin-1" });
      expect(result).toMatchObject({ scheduled: 1 });
    });
  });
});
