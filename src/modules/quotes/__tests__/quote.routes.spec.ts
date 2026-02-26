import Decimal from 'decimal.js';
import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { quoteRoutes } from "../quote.routes";
import { quoteService } from "../quote.service";

vi.mock("../quote.service", () => ({
  quoteService: {
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
  app.use("/api/quotes", quoteRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(quoteService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("quoteRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a quote", async () => {
    service.create.mockResolvedValue({ id: "quote-1" } as any);

    const res = await request(app)
      .post("/api/quotes")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Safari",
        amount: 2000,
      });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ agentId: "test-user", title: "Safari" })
    );
  });

  it("lists quotes", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/quotes")
      .query({ page: "2", limit: "5", bookingId: "550e8400-e29b-41d4-a716-446655440000" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5 })
    );
  });

  it("returns a quote", async () => {
    service.getById.mockResolvedValue({ id: "quote-1" } as any);

    const res = await request(app).get("/api/quotes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "quote-1" });
  });

  it("returns 404 when quote missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/quotes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Quote not found" });
  });

  it("updates a quote", async () => {
    service.update.mockResolvedValue({ id: "quote-1", status: "SENT" } as any);

    const res = await request(app)
      .patch("/api/quotes/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "SENT" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "SENT" })
    );
  });

  it("deletes a quote", async () => {
    service.remove.mockResolvedValue({
      id: 'quote-1',
      createdAt: new Date(),
      amount: new Decimal(1000),
      currency: 'USD',
      commissionRate: new Decimal(0.1),
      commissionAmount: new Decimal(100),
      commissionCurrency: 'KES',
      bookingId: 'booking-1',
      agentId: 'agent-1',
      title: 'Test Quote',
      status: 'DRAFT',
      expiresAt: null,
      items: null,
      notes: null
    });

    const res = await request(app).delete("/api/quotes/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
