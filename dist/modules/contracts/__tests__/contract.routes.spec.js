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
const contract_routes_1 = require("../contract.routes");
const contract_service_1 = require("../contract.service");
vitest_1.vi.mock("../contract.service", () => ({
    contractService: {
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
    app.use("/api/contracts", contract_routes_1.contractRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(contract_service_1.contractService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("contractRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a contract", async () => {
        service.create.mockResolvedValue({ id: "contract-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/contracts")
            .send({ bookingId: "550e8400-e29b-41d4-a716-446655440000" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ bookingId: "550e8400-e29b-41d4-a716-446655440000" }));
    });
    (0, vitest_1.it)("lists contracts", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/contracts")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
    });
    (0, vitest_1.it)("returns a contract", async () => {
        service.getById.mockResolvedValue({ id: "contract-1" });
        const res = await (0, supertest_1.default)(app).get("/api/contracts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "contract-1" });
    });
    (0, vitest_1.it)("returns 404 when contract missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/contracts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Contract not found" });
    });
    (0, vitest_1.it)("updates a contract", async () => {
        service.update.mockResolvedValue({ id: "contract-1", status: "SIGNED" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/contracts/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "SIGNED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "SIGNED" }));
    });
    (0, vitest_1.it)("deletes a contract", async () => {
        service.remove.mockResolvedValue({
            id: 'contract-1',
            createdAt: new Date(),
            status: 'DRAFT',
            bookingId: 'booking-1',
            metadata: {},
            partnerId: null,
            fileUrl: null,
            signedAt: null
        });
        const res = await (0, supertest_1.default)(app).delete("/api/contracts/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=contract.routes.spec.js.map