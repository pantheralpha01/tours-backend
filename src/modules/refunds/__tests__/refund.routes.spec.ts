import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { refundRoutes } from "../refund.routes";
import { refundService } from "../refund.service";

vi.mock("../refund.service", () => ({
  refundService: {
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
  app.use("/api/refunds", refundRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(refundService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("refundRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a refund", async () => {
    service.create.mockResolvedValue({ id: "refund-1" } as any);

    const res = await request(app)
      .post("/api/refunds")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        paymentId: "550e8400-e29b-41d4-a716-446655440000",
        amount: 200,
        reason: "Overpayment",
      });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalled();
  });

  it("lists refunds", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/refunds")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
  });

  it("retrieves a refund", async () => {
    service.getById.mockResolvedValue({ id: "refund-1" } as any);

    const res = await request(app).get("/api/refunds/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "refund-1" });
  });

  it("returns 404 when refund missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/refunds/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Refund not found" });
  });

  it("updates a refund", async () => {
    service.update.mockResolvedValue({ id: "refund-1", status: "APPROVED" } as any);

    const res = await request(app)
      .put("/api/refunds/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "APPROVED" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "APPROVED" })
    );
  });

  it("deletes a refund", async () => {
    service.remove.mockResolvedValue(undefined);

    const res = await request(app).delete("/api/refunds/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
