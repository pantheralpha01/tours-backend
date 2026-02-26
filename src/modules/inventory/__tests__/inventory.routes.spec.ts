import Decimal from 'decimal.js';
import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { inventoryRoutes } from "../inventory.routes";
import { inventoryService } from "../inventory.service";

vi.mock("../inventory.service", () => ({
  inventoryService: {
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
  app.use("/api/inventory", inventoryRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(inventoryService);

describe("inventoryRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an inventory item", async () => {
    service.create.mockResolvedValue({ id: "inventory-1" } as any);

    const res = await request(app)
      .post("/api/inventory")
      .send({ partnerId: "550e8400-e29b-41d4-a716-446655440000", title: "Jeep", price: 250 });

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Jeep", partnerId: "550e8400-e29b-41d4-a716-446655440000" })
    );
  });

  it("lists inventory items", async () => {
    service.list.mockResolvedValue({ data: [], meta: {} } as any);

    const res = await request(app).get("/api/inventory");

    expect(res.status).toBe(200);
    expect(service.list).toHaveBeenCalledWith({ createdById: undefined });
  });

  it("retrieves an inventory item", async () => {
    service.getById.mockResolvedValue({ id: "inventory-1", partner: { createdById: "admin" } } as any);

    const res = await request(app).get("/api/inventory/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "inventory-1", partner: { createdById: "admin" } });
  });

  it("returns 404 when inventory is missing", async () => {
    service.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/inventory/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Inventory item not found" });
  });

  it("updates an inventory item", async () => {
    service.update.mockResolvedValue({ id: "inventory-1", status: "ACTIVE" } as any);

    const res = await request(app)
      .patch("/api/inventory/550e8400-e29b-41d4-a716-446655440000")
      .send({ status: "ACTIVE" });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ status: "ACTIVE" })
    );
  });

  it("deletes an inventory item", async () => {
    service.remove.mockResolvedValue({
      id: 'inventory-1',
      createdAt: new Date(),
      status: 'DRAFT',
      title: 'Test Inventory',
      description: null,
      partnerId: 'partner-1',
      price: new Decimal(1000)
    });

    const res = await request(app).delete("/api/inventory/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
