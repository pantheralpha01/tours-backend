import Decimal from 'decimal.js';
import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { paymentRoutes } from "../payment.routes";
import { paymentService } from "../payment.service";

vi.mock("../payment.service", () => ({
  paymentService: {
    create: vi.fn(),
    initiate: vi.fn(),
    registerManual: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    processWebhookEvent: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf.toString();
      },
    })
  );
  app.use("/api/payments", paymentRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(paymentService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("paymentRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts provider webhooks", async () => {
    service.processWebhookEvent.mockResolvedValue({ handled: true } as any);

    const res = await request(app)
      .post("/api/payments/webhooks/CRYPTO")
      .set("x-webhook-signature", "deadbeef")
      .send({
        reference: "PAY123",
        status: "COMPLETED",
        amount: 1200,
        currency: "USD",
        eventType: "charge.succeeded",
      });

    expect(res.status).toBe(202);
    expect(res.body).toEqual({ status: "accepted", result: { handled: true } });
    expect(service.processWebhookEvent).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "CRYPTO", reference: "PAY123" })
    );
  });

  it("creates a payment", async () => {
    service.create.mockResolvedValue({ id: "pay-1" } as any);

    const res = await request(app)
      .post("/api/payments")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        provider: "STRIPE",
        amount: 1500,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "pay-1" });
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: "550e8400-e29b-41d4-a716-446655440000", actorId: "test-user" })
    );
  });

  it("initiates a payment", async () => {
    service.initiate.mockResolvedValue({ url: "https://pay" } as any);

    const res = await request(app)
      .post("/api/payments/initiate")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        provider: "MPESA",
        amount: 250,
      });

    expect(res.status).toBe(201);
    expect(service.initiate).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "MPESA", actorId: "test-user" })
    );
  });

  it("registers a manual payment", async () => {
    service.registerManual.mockResolvedValue({ id: "manual-1" } as any);

    const res = await request(app)
      .post("/api/payments/manual")
      .send({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        amount: 100,
        provider: "CASH",
      });

    expect(res.status).toBe(201);
    expect(service.registerManual).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100, actorId: "test-user" })
    );
  });

  it("lists payments", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/payments")
      .query({ page: "2", limit: "5", status: "COMPLETED" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5, status: "COMPLETED" })
    );
  });

  it("retrieves a payment", async () => {
    service.getById.mockResolvedValue({ id: "pay-1" } as any);

    const res = await request(app).get("/api/payments/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(service.getById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("updates a payment", async () => {
    service.update.mockResolvedValue({ id: "pay-1", state: "COMPLETED" } as any);

    const res = await request(app)
      .put("/api/payments/550e8400-e29b-41d4-a716-446655440000")
      .send({ state: "COMPLETED" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "pay-1", state: "COMPLETED" });
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ state: "COMPLETED" })
    );
  });

  it("deletes a payment", async () => {
    service.remove.mockResolvedValue({
      id: 'pay-1',
      createdAt: new Date(),
      amount: new Decimal(1000),
      currency: 'USD',
      bookingId: 'booking-1',
      metadata: {},
      provider: 'TestProvider',
      state: 'INITIATED',
      reference: null,
      recordedById: null
    });

    const res = await request(app).delete("/api/payments/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
