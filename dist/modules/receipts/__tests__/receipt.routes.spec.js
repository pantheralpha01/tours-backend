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
const receipt_routes_1 = require("../receipt.routes");
const receipt_service_1 = require("../receipt.service");
vitest_1.vi.mock("../receipt.service", () => ({
    receiptService: {
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
    app.use("/api/receipts", receipt_routes_1.receiptRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(receipt_service_1.receiptService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("receiptRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a receipt", async () => {
        service.create.mockResolvedValue({ id: "receipt-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/receipts")
            .send({
            bookingId: "550e8400-e29b-41d4-a716-446655440000",
            paymentId: "550e8400-e29b-41d4-a716-446655440000",
            receiptNumber: "RCPT-1",
            amount: 1500,
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalled();
    });
    (0, vitest_1.it)("lists receipts", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/receipts")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
    });
    (0, vitest_1.it)("retrieves a receipt", async () => {
        service.getById.mockResolvedValue({ id: "receipt-1" });
        const res = await (0, supertest_1.default)(app).get("/api/receipts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "receipt-1" });
    });
    (0, vitest_1.it)("returns 404 when receipt missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/receipts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Receipt not found" });
    });
    (0, vitest_1.it)("updates a receipt", async () => {
        service.update.mockResolvedValue({ id: "receipt-1", status: "VOID" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/receipts/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "VOID" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "VOID" }));
    });
    (0, vitest_1.it)("deletes a receipt", async () => {
        service.remove.mockResolvedValue({
            id: 'receipt-1',
            amount: new decimal_js_1.default(1000),
            currency: 'USD',
            status: 'ISSUED',
            bookingId: 'booking-1',
            fileUrl: null,
            paymentId: 'pay-1',
            receiptNumber: 'R-001',
            issuedAt: new Date()
        });
        const res = await (0, supertest_1.default)(app).delete("/api/receipts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=receipt.routes.spec.js.map