import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { contractRoutes } from "../contract.routes";
import { contractService } from "../contract.service";

vi.mock("../contract.service", () => ({
  contractService: {
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
  app.use("/api/contracts", contractRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(contractService);

const paginatedResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

describe("contractRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a contract", async () => {
    service.create.mockResolvedValue({ id: "contract-1" } as any);

    const res = await request(app)
      .post("/api/contracts")
      .send({ bookingId: "550e8400-e29b-41d4-a716-446655440000" });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: "550e8400-e29b-41d4-a716-446655440000" })
    );
  });

  it("lists contracts", async () => {
    service.list.mockResolvedValue(paginatedResponse as any);

    const res = await request(app)
      .get("/api/contracts")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedResponse);
  });

  it("returns a contract", async () => {
    service.getById.mockResolvedValue({ id: "contract-1" } as any);

    const res = await request(app).get("/api/contracts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "contract-1" });
  });

  it("returns 404 when contract missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/contracts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Contract not found" });
  });

  it("updates a contract", async () => {
    service.update.mockResolvedValue({ id: "contract-1", status: "SIGNED" } as any);

    const res = await request(app)
      .patch("/api/contracts/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "SIGNED" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "SIGNED" })
    );
  });

  it("deletes a contract", async () => {
    service.remove.mockResolvedValue({
      id: 'contract-1',
      createdAt: new Date(),
      status: 'DRAFT',
      bookingId: 'booking-1',
      metadata: {},
      partnerId: null,
      fileUrl: null,
      signedAt: null
    });

    const res = await request(app).delete("/api/contracts/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
