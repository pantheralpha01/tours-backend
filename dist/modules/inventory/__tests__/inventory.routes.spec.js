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
const inventory_routes_1 = require("../inventory.routes");
const inventory_service_1 = require("../inventory.service");
vitest_1.vi.mock("../inventory.service", () => ({
    inventoryService: {
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
    app.use("/api/inventory", inventory_routes_1.inventoryRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(inventory_service_1.inventoryService);
(0, vitest_1.describe)("inventoryRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates an inventory item", async () => {
        service.create.mockResolvedValue({ id: "inventory-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/inventory")
            .send({ partnerId: "550e8400-e29b-41d4-a716-446655440000", title: "Jeep", price: 250 });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ title: "Jeep", partnerId: "550e8400-e29b-41d4-a716-446655440000" }));
    });
    (0, vitest_1.it)("lists inventory items", async () => {
        service.list.mockResolvedValue({ data: [], meta: {} });
        const res = await (0, supertest_1.default)(app).get("/api/inventory");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.list).toHaveBeenCalledWith({ createdById: undefined });
    });
    (0, vitest_1.it)("retrieves an inventory item", async () => {
        service.getById.mockResolvedValue({ id: "inventory-1", partner: { createdById: "admin" } });
        const res = await (0, supertest_1.default)(app).get("/api/inventory/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "inventory-1", partner: { createdById: "admin" } });
    });
    (0, vitest_1.it)("returns 404 when inventory is missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/inventory/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Inventory item not found" });
    });
    (0, vitest_1.it)("updates an inventory item", async () => {
        service.update.mockResolvedValue({ id: "inventory-1", status: "ACTIVE" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/inventory/550e8400-e29b-41d4-a716-446655440000")
            .send({ status: "ACTIVE" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ status: "ACTIVE" }));
    });
    (0, vitest_1.it)("deletes an inventory item", async () => {
        service.remove.mockResolvedValue({
            id: 'inventory-1',
            createdAt: new Date(),
            status: 'DRAFT',
            title: 'Test Inventory',
            description: null,
            partnerId: 'partner-1',
            price: new decimal_js_1.default(1000)
        });
        const res = await (0, supertest_1.default)(app).delete("/api/inventory/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=inventory.routes.spec.js.map