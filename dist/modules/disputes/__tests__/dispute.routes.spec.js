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
const dispute_routes_1 = require("../dispute.routes");
const dispute_service_1 = require("../dispute.service");
vitest_1.vi.mock("../dispute.service", () => ({
    disputeService: {
        create: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        remove: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/disputes", dispute_routes_1.disputeRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(dispute_service_1.disputeService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("disputeRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a dispute", async () => {
        service.create.mockResolvedValue({ id: "dispute-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/disputes")
            .send({ bookingId: "550e8400-e29b-41d4-a716-446655440000", reason: "Service not delivered" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ openedById: "test-user" }));
    });
    (0, vitest_1.it)("lists disputes", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/disputes")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
    });
    (0, vitest_1.it)("retrieves a dispute", async () => {
        service.getById.mockResolvedValue({ id: "dispute-1" });
        const res = await (0, supertest_1.default)(app).get("/api/disputes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "dispute-1" });
    });
    (0, vitest_1.it)("returns 404 when dispute missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/disputes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Dispute not found" });
    });
    (0, vitest_1.it)("updates a dispute", async () => {
        service.update.mockResolvedValue({ id: "dispute-1", status: "RESOLVED" });
        const res = await (0, supertest_1.default)(app)
            .put("/api/disputes/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "RESOLVED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "RESOLVED" }));
    });
    (0, vitest_1.it)("deletes a dispute", async () => {
        service.remove.mockResolvedValue({
            id: 'dispute-1',
            createdAt: new Date(),
            status: 'OPEN',
            bookingId: 'booking-1',
            reason: 'Test Reason',
            description: null,
            openedById: 'user-1',
            assignedToId: null,
            resolvedAt: null
        });
        const res = await (0, supertest_1.default)(app).delete("/api/disputes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=dispute.routes.spec.js.map