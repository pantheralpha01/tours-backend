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
const quote_routes_1 = require("../quote.routes");
const quote_service_1 = require("../quote.service");
vitest_1.vi.mock("../quote.service", () => ({
    quoteService: {
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
    app.use("/api/quotes", quote_routes_1.quoteRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(quote_service_1.quoteService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("quoteRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a quote", async () => {
        service.create.mockResolvedValue({ id: "quote-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/quotes")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            title: "Safari",
            amount: 2000,
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ agentId: "test-user", title: "Safari" }));
    });
    (0, vitest_1.it)("lists quotes", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/quotes")
            .query({ page: "2", limit: "5", bookingId: "550e8400-e29b-41d4-a716-446655440000" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.list).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 5 }));
    });
    (0, vitest_1.it)("returns a quote", async () => {
        service.getById.mockResolvedValue({ id: "quote-1" });
        const res = await (0, supertest_1.default)(app).get("/api/quotes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "quote-1" });
    });
    (0, vitest_1.it)("returns 404 when quote missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/quotes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Quote not found" });
    });
    (0, vitest_1.it)("updates a quote", async () => {
        service.update.mockResolvedValue({ id: "quote-1", status: "SENT" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/quotes/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "SENT" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "SENT" }));
    });
    (0, vitest_1.it)("deletes a quote", async () => {
        service.remove.mockResolvedValue({
            id: 'quote-1',
            createdAt: new Date(),
            amount: new decimal_js_1.default(1000),
            currency: 'USD',
            commissionRate: new decimal_js_1.default(0.1),
            commissionAmount: new decimal_js_1.default(100),
            commissionCurrency: 'KES',
            bookingId: 'booking-1',
            agentId: 'agent-1',
            title: 'Test Quote',
            status: 'DRAFT',
            expiresAt: null,
            items: null,
            notes: null
        });
        const res = await (0, supertest_1.default)(app).delete("/api/quotes/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=quote.routes.spec.js.map