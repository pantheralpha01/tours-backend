import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { offerRoutes } from "../offer.routes";
import { offerService } from "../offer.service";

vi.mock("../offer.service", () => ({
  offerService: {
    createTemplate: vi.fn(),
    listTemplates: vi.fn(),
    getTemplateById: vi.fn(),
    calculatePrice: vi.fn(),
    createProposal: vi.fn(),
    listProposals: vi.fn(),
    getProposalById: vi.fn(),
    generateAssetsForProposal: vi.fn(),
    generateContract: vi.fn(),
    approveProposal: vi.fn(),
    publishProposal: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/offers", offerRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(offerService);

describe("offerRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a template", async () => {
    service.createTemplate.mockResolvedValue({ id: "tmpl-1" } as any);

    const res = await request(app)
      .post("/api/offers/templates")
      .send({ name: "Standard", slug: "standard", baseAmount: 1000 });

    expect(res.status).toBe(201);
    expect(service.createTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Standard", actorId: "test-user" })
    );
  });

  it("lists templates", async () => {
    service.listTemplates.mockResolvedValue({ data: [], meta: {} } as any);

    const res = await request(app).get("/api/offers/templates");

    expect(res.status).toBe(200);
    expect(service.listTemplates).toHaveBeenCalled();
  });

  it("fetches a template", async () => {
    service.getTemplateById.mockResolvedValue({ id: "tmpl-1" } as any);

    const res = await request(app).get("/api/offers/templates/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(service.getTemplateById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("returns 404 when template missing", async () => {
    service.getTemplateById.mockResolvedValue(null);

    const res = await request(app).get("/api/offers/templates/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Template not found" });
  });

  it("calculates price", async () => {
    service.calculatePrice.mockReturnValue({ total: 1200 } as any);

    const res = await request(app)
      .post("/api/offers/calculate")
      .send({ baseAmount: 1000 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 1200 });
  });

  it("creates a proposal", async () => {
    service.createProposal.mockResolvedValue({ id: "prop-1" } as any);

    const res = await request(app)
      .post("/api/offers/proposals")
      .send({ baseAmount: 1000, bookingId: "550e8400-e29b-41d4-a716-446655440000" });

    expect(res.status).toBe(201);
    expect(service.createProposal).toHaveBeenCalled();
  });

  it("lists proposals", async () => {
    service.listProposals.mockResolvedValue({ data: [], meta: {} } as any);

    const res = await request(app)
      .get("/api/offers/proposals")
      .query({ page: "2", limit: "5" });

    expect(res.status).toBe(200);
    expect(service.listProposals).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5 })
    );
  });

  it("gets a proposal", async () => {
    service.getProposalById.mockResolvedValue({ id: "prop-1" } as any);

    const res = await request(app).get("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000");

    expect(res.status).toBe(200);
    expect(service.getProposalById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("generates proposal assets", async () => {
    service.generateAssetsForProposal.mockResolvedValue({ id: "prop-1" } as any);

    const res = await request(app)
      .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/assets")
      .query({ logo: "false" });

    expect(res.status).toBe(200);
    expect(service.generateAssetsForProposal).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      { logo: false, signature: true }
    );
  });

  it("generates a contract", async () => {
    service.generateContract.mockResolvedValue({ id: "prop-1", contractUrl: "url" } as any);

    const res = await request(app).post(
      "/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/contract"
    );

    expect(res.status).toBe(200);
    expect(service.generateContract).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("approves a proposal", async () => {
    service.approveProposal.mockResolvedValue({ id: "prop-1", status: "APPROVED" } as any);

    const res = await request(app)
      .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/approve")
      .send({ notes: "Looks good" });

    expect(res.status).toBe(200);
    expect(service.approveProposal).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ actorId: "test-user", notes: "Looks good" })
    );
  });

  it("publishes a proposal", async () => {
    service.publishProposal.mockResolvedValue({ id: "prop-1", status: "PUBLISHED" } as any);

    const res = await request(app)
      .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/publish")
      .send({ channel: "EMAIL" });

    expect(res.status).toBe(200);
    expect(service.publishProposal).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
      expect.objectContaining({ channel: "EMAIL", actorId: "test-user" })
    );
  });
});
