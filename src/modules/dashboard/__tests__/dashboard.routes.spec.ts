import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { dashboardRoutes } from "../dashboard.routes";
import { dashboardService } from "../dashboard.service";

vi.mock("../dashboard.service", () => ({
  dashboardService: {
    getSummary: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/dashboard", dashboardRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(dashboardService);

describe("dashboardRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns dashboard summary", async () => {
    service.getSummary.mockResolvedValue({
      bookingsInProgress: 5,
      pendingPartnerApprovals: 2,
      openDisputes: 1,
      generatedAt: new Date().toISOString(),
    });

    const res = await request(app).get("/api/dashboard/summary");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("bookingsInProgress");
    expect(service.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({ role: "ADMIN" })
    );
  });
});
