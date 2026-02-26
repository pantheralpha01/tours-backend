import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { partnerRoutes } from "../partner.routes";
import { partnerService } from "../partner.service";
import { partnerEventService } from "../partner-event.service";

vi.mock("../partner.service", () => ({
  partnerService: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("../partner-event.service", () => ({
  partnerEventService: {
    list: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/partners", partnerRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(partnerService);
const events = vi.mocked(partnerEventService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("partnerRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a partner", async () => {
    service.create.mockResolvedValue({ id: "partner-1" } as any);

    const res = await request(app)
      .post("/api/partners")
      .send({ name: "Safari Adventures" });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ createdById: "test-user" })
    );
  });

  it("lists partners", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/partners")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
  });

  it("returns a partner", async () => {
    service.getById.mockResolvedValue({ id: "partner-1", createdById: "test-user" } as any);

    const res = await request(app).get("/api/partners/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "partner-1", createdById: "test-user" });
  });

  it("returns 404 when partner missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/partners/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Partner not found" });
  });

  it("updates a partner", async () => {
    service.update.mockResolvedValue({ id: "partner-1", name: "Updated" } as any);

    const res = await request(app)
      .patch("/api/partners/550e8400-e29b-41d4-a716-446655440000")
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ name: "Updated" })
    );
  });

  it("approves a partner", async () => {
    service.approve.mockResolvedValue({ id: "partner-1", approvalStatus: "APPROVED" } as any);

    const res = await request(app).post("/api/partners/550e8400-e29b-41d4-a716-446655440000/approve");

    expect(res.status).toBe(200);
    expect(service.approve).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      "test-user"
    );
  });

  it("rejects a partner", async () => {
    service.reject.mockResolvedValue({ id: "partner-1", approvalStatus: "REJECTED" } as any);

    const res = await request(app)
      .post("/api/partners/550e8400-e29b-41d4-a716-446655440000/reject")
      .send({ reason: "Incomplete docs" });

    expect(res.status).toBe(200);
    expect(service.reject).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      "test-user",
      "Incomplete docs"
    );
  });

  it("lists partner events", async () => {
    service.getById.mockResolvedValue({ id: "partner-1", createdById: "test-user" } as any);
    events.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/partners/550e8400-e29b-41d4-a716-446655440000/events")
      .query({ type: "APPROVED" });

    expect(res.status).toBe(200);
    expect(events.list).toHaveBeenCalledWith(
      expect.objectContaining({ partnerId: "550e8400-e29b-41d4-a716-446655440000", type: "APPROVED" })
    );
  });

  it("deletes a partner", async () => {
    service.remove.mockResolvedValue({
      name: 'Test Partner',
      id: 'partner-1',
      email: null,
      isActive: true,
      createdAt: new Date(),
      phone: null,
      approvalStatus: 'PENDING',
      approvedById: null,
      approvedAt: null,
      rejectedReason: null,
      createdById: null
    });

    const res = await request(app).delete("/api/partners/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
