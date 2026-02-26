import Decimal from 'decimal.js';
import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { bookingRoutes } from "../booking.routes";
import { bookingService } from "../booking.service";

vi.mock("../booking.service", () => ({
  bookingService: {
    create: vi.fn(),
    list: vi.fn(),
    listEvents: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    transitionStatus: vi.fn(),
    remove: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/bookings", bookingRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(bookingService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("bookingRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking", async () => {
    service.create.mockResolvedValue({ id: "booking-1" } as any);

    const res = await request(app)
      .post("/api/bookings")
      .send({ customerName: "Alice Smith", serviceTitle: "Safari", amount: 2500 });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Alice Smith",
        agentId: "test-user",
        actorId: "test-user",
      })
    );
  });

  it("lists bookings with filters", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/bookings")
      .query({ page: "2", limit: "5", status: "CONFIRMED" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5, status: "CONFIRMED" })
    );
  });

  it("lists calendar bookings", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);
    const serviceStartFrom = "2024-01-01T00:00:00.000Z";
    const serviceStartTo = "2024-02-01T00:00:00.000Z";

    const res = await request(app)
      .get("/api/bookings/calendar")
      .query({
        serviceStartFrom,
        serviceStartTo,
        sort: "serviceStartAt:desc",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.list).toHaveBeenLastCalledWith(
      expect.objectContaining({
        serviceStartFrom: new Date(serviceStartFrom),
        serviceStartTo: new Date(serviceStartTo),
        sort: "serviceStartAt:desc",
      })
    );
  });

  it("gets a booking by id", async () => {
    service.getById.mockResolvedValue({ id: "booking-1", agentId: "test-user" } as any);

    const res = await request(app).get("/api/bookings/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "booking-1", agentId: "test-user" });
  });

  it("updates a booking", async () => {
    service.update.mockResolvedValue({ id: "booking-1", amount: 3000 } as any);

    const res = await request(app)
      .patch("/api/bookings/550e8400-e29b-41d4-a716-446655440000")
      .send({ amount: 3000 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "booking-1", amount: 3000 });
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ amount: 3000, actorId: "test-user" })
    );
  });

  it("transitions a booking", async () => {
    service.transitionStatus.mockResolvedValue({ id: "booking-1", status: "CONFIRMED" } as any);

    const res = await request(app)
      .put("/api/bookings/550e8400-e29b-41d4-a716-446655440000/transition")
      .send({ toStatus: "CONFIRMED", transitionReason: "Payment complete" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "booking-1", status: "CONFIRMED" });
    expect(service.transitionStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "550e8400-e29b-41d4-a716-446655440000",
        toStatus: "CONFIRMED",
        transitionReason: "Payment complete",
        actorId: "test-user",
      })
    );
  });

  it("deletes a booking", async () => {
    service.remove.mockResolvedValue({
      id: 'booking-1',
      createdAt: new Date(),
      customerName: 'Test Customer',
      serviceTitle: 'Test Service',
      amount: new Decimal(1000),
      currency: 'USD',
      commissionRate: new Decimal(0.1),
      commissionAmount: new Decimal(100),
      commissionCurrency: 'KES',
      status: 'DRAFT',
      paymentStatus: 'UNPAID',
      splitPaymentEnabled: false,
      depositPercentage: null,
      depositAmount: null,
      depositDueDate: null,
      balanceAmount: null,
      balanceDueDate: null,
      splitPaymentNotes: null,
      agentId: 'agent-1',
      serviceStartAt: null,
      serviceEndAt: null,
      serviceTimezone: null
    });

    const res = await request(app).delete("/api/bookings/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("lists booking events", async () => {
    service.getById.mockResolvedValue({ id: "booking-1", agentId: "test-user" } as any);
    service.listEvents.mockResolvedValue(paginatedResponse as any);

    const res = await request(app).get("/api/bookings/550e8400-e29b-41d4-a716-446655440000/events");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
    expect(service.listEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        page: 1,
        limit: 10,
        sort: "desc",
      })
    );
  });
});
