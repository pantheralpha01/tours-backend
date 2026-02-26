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
const booking_routes_1 = require("../booking.routes");
const booking_service_1 = require("../booking.service");
vitest_1.vi.mock("../booking.service", () => ({
    bookingService: {
        create: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
        listEvents: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        transitionStatus: vitest_1.vi.fn(),
        remove: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/bookings", booking_routes_1.bookingRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(booking_service_1.bookingService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("bookingRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a booking", async () => {
        service.create.mockResolvedValue({ id: "booking-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/bookings")
            .send({ customerName: "Alice Smith", serviceTitle: "Safari", amount: 2500 });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            customerName: "Alice Smith",
            agentId: "test-user",
            actorId: "test-user",
        }));
    });
    (0, vitest_1.it)("lists bookings with filters", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/bookings")
            .query({ page: "2", limit: "5", status: "CONFIRMED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.list).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 5, status: "CONFIRMED" }));
    });
    (0, vitest_1.it)("lists calendar bookings", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const serviceStartFrom = "2024-01-01T00:00:00.000Z";
        const serviceStartTo = "2024-02-01T00:00:00.000Z";
        const res = await (0, supertest_1.default)(app)
            .get("/api/bookings/calendar")
            .query({
            serviceStartFrom,
            serviceStartTo,
            sort: "serviceStartAt:desc",
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.list).toHaveBeenLastCalledWith(vitest_1.expect.objectContaining({
            serviceStartFrom: new Date(serviceStartFrom),
            serviceStartTo: new Date(serviceStartTo),
            sort: "serviceStartAt:desc",
        }));
    });
    (0, vitest_1.it)("gets a booking by id", async () => {
        service.getById.mockResolvedValue({ id: "booking-1", agentId: "test-user" });
        const res = await (0, supertest_1.default)(app).get("/api/bookings/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "booking-1", agentId: "test-user" });
    });
    (0, vitest_1.it)("updates a booking", async () => {
        service.update.mockResolvedValue({ id: "booking-1", amount: 3000 });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/bookings/550e8400-e29b-41d4-a716-446655440000")
            .send({ amount: 3000 });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "booking-1", amount: 3000 });
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ amount: 3000, actorId: "test-user" }));
    });
    (0, vitest_1.it)("transitions a booking", async () => {
        service.transitionStatus.mockResolvedValue({ id: "booking-1", status: "CONFIRMED" });
        const res = await (0, supertest_1.default)(app)
            .put("/api/bookings/550e8400-e29b-41d4-a716-446655440000/transition")
            .send({ toStatus: "CONFIRMED", transitionReason: "Payment complete" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "booking-1", status: "CONFIRMED" });
        (0, vitest_1.expect)(service.transitionStatus).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            id: "550e8400-e29b-41d4-a716-446655440000",
            toStatus: "CONFIRMED",
            transitionReason: "Payment complete",
            actorId: "test-user",
        }));
    });
    (0, vitest_1.it)("deletes a booking", async () => {
        service.remove.mockResolvedValue({
            id: 'booking-1',
            createdAt: new Date(),
            customerName: 'Test Customer',
            serviceTitle: 'Test Service',
            amount: new decimal_js_1.default(1000),
            currency: 'USD',
            commissionRate: new decimal_js_1.default(0.1),
            commissionAmount: new decimal_js_1.default(100),
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
        const res = await (0, supertest_1.default)(app).delete("/api/bookings/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("lists booking events", async () => {
        service.getById.mockResolvedValue({ id: "booking-1", agentId: "test-user" });
        service.listEvents.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app).get("/api/bookings/550e8400-e29b-41d4-a716-446655440000/events");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
        (0, vitest_1.expect)(service.listEvents).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            page: 1,
            limit: 10,
            sort: "desc",
        }));
    });
});
//# sourceMappingURL=booking.routes.spec.js.map