"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const vitest_1 = require("vitest");
const errorHandler_1 = require("../../../middleware/errorHandler");
const notFound_1 = require("../../../middleware/notFound");
const refund_routes_1 = require("../refund.routes");
const refund_service_1 = require("../refund.service");
vitest_1.vi.mock("../refund.service", () => ({
    refundService: {
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
    app.use("/api/refunds", refund_routes_1.refundRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(refund_service_1.refundService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("refundRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a refund", async () => {
        service.create.mockResolvedValue({ id: "refund-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/refunds")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            paymentId: "550e8400-e29b-41d4-a716-446655440000",
            amount: 200,
            reason: "Overpayment",
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalled();
    });
    (0, vitest_1.it)("lists refunds", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/refunds")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
    });
    (0, vitest_1.it)("retrieves a refund", async () => {
        service.getById.mockResolvedValue({ id: "refund-1" });
        const res = await (0, supertest_1.default)(app).get("/api/refunds/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "refund-1" });
    });
    (0, vitest_1.it)("returns 404 when refund missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/refunds/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Refund not found" });
    });
    (0, vitest_1.it)("updates a refund", async () => {
        service.update.mockResolvedValue({ id: "refund-1", status: "APPROVED" });
        const res = await (0, supertest_1.default)(app)
            .put("/api/refunds/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "APPROVED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "APPROVED" }));
    });
    (0, vitest_1.it)("deletes a refund", async () => {
        service.remove.mockResolvedValue({
            id: 'refund-1',
            createdAt: new Date(),
            amount: new decimal_js_1.default(1000),
            currency: 'USD',
            status: 'REQUESTED',
            bookingId: 'booking-1',
            reason: 'Test Reason',
            reference: null,
            processedAt: null,
            paymentId: 'pay-1'
        });
        const res = await (0, supertest_1.default)(app).delete("/api/refunds/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=refund.routes.spec.js.map