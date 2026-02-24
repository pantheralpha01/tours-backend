import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { disputeRoutes } from "../dispute.routes";
import { disputeService } from "../dispute.service";

vi.mock("../dispute.service", () => ({
  disputeService: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/disputes", disputeRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(disputeService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("disputeRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a dispute", async () => {
    service.create.mockResolvedValue({ id: "dispute-1" } as any);

    const res = await request(app)
      .post("/api/disputes")
      .send({ bookingId: "550e8400-e29b-41d4-a716-446655440000", reason: "Service not delivered" });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ openedById: "test-user" })
    );
  });

  it("lists disputes", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/disputes")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
  });

  it("retrieves a dispute", async () => {
    service.getById.mockResolvedValue({ id: "dispute-1" } as any);

    const res = await request(app).get("/api/disputes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "dispute-1" });
  });

  it("returns 404 when dispute missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/disputes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Dispute not found" });
  });

  it("updates a dispute", async () => {
    service.update.mockResolvedValue({ id: "dispute-1", status: "RESOLVED" } as any);

    const res = await request(app)
      .put("/api/disputes/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "RESOLVED" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "RESOLVED" })
    );
  });

  it("deletes a dispute", async () => {
    service.remove.mockResolvedValue(undefined);

    const res = await request(app).delete("/api/disputes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
