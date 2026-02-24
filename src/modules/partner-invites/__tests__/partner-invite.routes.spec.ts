import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import {
  partnerInviteRoutes,
  partnerInvitePublicRoutes,
} from "../partner-invite.routes";
import { partnerInviteService } from "../partner-invite.service";

vi.mock("../partner-invite.service", () => ({
  partnerInviteService: {
    create: vi.fn(),
    list: vi.fn(),
    accept: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/partners/invites", partnerInviteRoutes);
  app.use("/api/public/partner-invites", partnerInvitePublicRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(partnerInviteService);

describe("partnerInviteRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an invite", async () => {
    service.create.mockResolvedValue({ id: "invite-1" } as any);

    const res = await request(app)
      .post("/api/partners/invites")
      .send({ companyName: "Acme", email: "team@acme.com" });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ invitedById: "test-user" })
    );
  });

  it("lists invites", async () => {
    service.list.mockResolvedValue({ data: [], meta: {} } as any);

    const res = await request(app)
      .get("/api/partners/invites")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(service.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5 })
    );
  });

  it("accepts an invite publicly", async () => {
    service.accept.mockResolvedValue({ id: "invite-1" } as any);

    const res = await request(app)
      .post("/api/public/partner-invites/token-123/accept")
      .send({ contactName: "Jane" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Invite accepted");
    expect(service.accept).toHaveBeenCalledWith(
      "token-123",
      expect.objectContaining({ contactName: "Jane" })
    );
  });
});
