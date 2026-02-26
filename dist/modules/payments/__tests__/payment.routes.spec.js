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
const payment_routes_1 = require("../payment.routes");
const payment_service_1 = require("../payment.service");
vitest_1.vi.mock("../payment.service", () => ({
    paymentService: {
        create: vitest_1.vi.fn(),
        initiate: vitest_1.vi.fn(),
        registerManual: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        remove: vitest_1.vi.fn(),
        processWebhookEvent: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json({
        verify: (req, _res, buf) => {
            req.rawBody = buf.toString();
        },
    }));
    app.use("/api/payments", payment_routes_1.paymentRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(payment_service_1.paymentService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("paymentRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("accepts provider webhooks", async () => {
        service.processWebhookEvent.mockResolvedValue({ handled: true });
        const res = await (0, supertest_1.default)(app)
            .post("/api/payments/webhooks/CRYPTO")
            .set("x-webhook-signature", "deadbeef")
            .send({
            reference: "PAY123",
            status: "COMPLETED",
            amount: 1200,
            currency: "USD",
            eventType: "charge.succeeded",
        });
        (0, vitest_1.expect)(res.status).toBe(202);
        (0, vitest_1.expect)(res.body).toEqual({ status: "accepted", result: { handled: true } });
        (0, vitest_1.expect)(service.processWebhookEvent).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ provider: "CRYPTO", reference: "PAY123" }));
    });
    (0, vitest_1.it)("creates a payment", async () => {
        service.create.mockResolvedValue({ id: "pay-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/payments")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            provider: "STRIPE",
            amount: 1500,
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body).toEqual({ id: "pay-1" });
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ bookingId: "550e8400-e29b-41d4-a716-446655440000", actorId: "test-user" }));
    });
    (0, vitest_1.it)("initiates a payment", async () => {
        service.initiate.mockResolvedValue({ url: "https://pay" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/payments/initiate")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            provider: "MPESA",
            amount: 250,
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.initiate).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ provider: "MPESA", actorId: "test-user" }));
    });
    (0, vitest_1.it)("registers a manual payment", async () => {
        service.registerManual.mockResolvedValue({ id: "manual-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/payments/manual")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            amount: 100,
            provider: "CASH",
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.registerManual).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ amount: 100, actorId: "test-user" }));
    });
    (0, vitest_1.it)("lists payments", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/payments")
            .query({ page: "2", limit: "5", status: "COMPLETED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.list).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 5, status: "COMPLETED" }));
    });
    (0, vitest_1.it)("retrieves a payment", async () => {
        service.getById.mockResolvedValue({ id: "pay-1" });
        const res = await (0, supertest_1.default)(app).get("/api/payments/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.getById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("updates a payment", async () => {
        service.update.mockResolvedValue({ id: "pay-1", state: "COMPLETED" });
        const res = await (0, supertest_1.default)(app)
            .put("/api/payments/550e8400-e29b-41d4-a716-446655440000")
            .send({ state: "COMPLETED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "pay-1", state: "COMPLETED" });
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ state: "COMPLETED" }));
    });
    (0, vitest_1.it)("deletes a payment", async () => {
        service.remove.mockResolvedValue({
            id: 'pay-1',
            createdAt: new Date(),
            amount: new decimal_js_1.default(1000),
            currency: 'USD',
            bookingId: 'booking-1',
            metadata: {},
            provider: 'TestProvider',
            state: 'INITIATED',
            reference: null,
            recordedById: null
        });
        const res = await (0, supertest_1.default)(app).delete("/api/payments/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=payment.routes.spec.js.map