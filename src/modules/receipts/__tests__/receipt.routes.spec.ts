import Decimal from 'decimal.js';
import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { receiptRoutes } from "../receipt.routes";
import { receiptService } from "../receipt.service";

vi.mock("../receipt.service", () => ({
  receiptService: {
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
  app.use("/api/receipts", receiptRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(receiptService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("receiptRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a receipt", async () => {
    service.create.mockResolvedValue({ id: "receipt-1" } as any);

    const res = await request(app)
      .post("/api/receipts")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        paymentId: "550e8400-e29b-41d4-a716-446655440000",
        receiptNumber: "RCPT-1",
        amount: 1500,
      });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalled();
  });

  it("lists receipts", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/receipts")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
  });

  it("retrieves a receipt", async () => {
    service.getById.mockResolvedValue({ id: "receipt-1" } as any);

    const res = await request(app).get("/api/receipts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "receipt-1" });
  });

  it("returns 404 when receipt missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/receipts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Receipt not found" });
  });

  it("updates a receipt", async () => {
    service.update.mockResolvedValue({ id: "receipt-1", status: "VOID" } as any);

    const res = await request(app)
      .patch("/api/receipts/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "VOID" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "VOID" })
    );
  });

  it("deletes a receipt", async () => {
    service.remove.mockResolvedValue({
      id: 'receipt-1',
      amount: new Decimal(1000),
      currency: 'USD',
      status: 'ISSUED',
      bookingId: 'booking-1',
      fileUrl: null,
      paymentId: 'pay-1',
      receiptNumber: 'R-001',
      issuedAt: new Date()
    });

    const res = await request(app).delete("/api/receipts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
