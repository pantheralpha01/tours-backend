"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const vitest_1 = require("vitest");
const errorHandler_1 = require("../../../middleware/errorHandler");
const notFound_1 = require("../../../middleware/notFound");
const dashboard_routes_1 = require("../dashboard.routes");
const dashboard_service_1 = require("../dashboard.service");
vitest_1.vi.mock("../dashboard.service", () => ({
    dashboardService: {
        getSummary: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/dashboard", dashboard_routes_1.dashboardRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(dashboard_service_1.dashboardService);
(0, vitest_1.describe)("dashboardRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns dashboard summary", async () => {
        service.getSummary.mockResolvedValue({
            bookingsInProgress: 5,
            pendingPartnerApprovals: 2,
            openDisputes: 1,
            generatedAt: new Date().toISOString(),
            bookingsTrend: [],
            partnersTrend: [],
            disputesTrend: []
        });
        const res = await (0, supertest_1.default)(app).get("/api/dashboard/summary");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toHaveProperty("bookingsInProgress");
        (0, vitest_1.expect)(service.getSummary).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ role: "ADMIN" }));
    });
});
//# sourceMappingURL=dashboard.routes.spec.js.map