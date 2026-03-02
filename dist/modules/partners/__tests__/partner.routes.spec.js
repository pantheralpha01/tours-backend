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
const partner_routes_1 = require("../partner.routes");
const partner_service_1 = require("../partner.service");
const partner_event_service_1 = require("../partner-event.service");
vitest_1.vi.mock("../partner.service", () => ({
    partnerService: {
        create: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        approve: vitest_1.vi.fn(),
        reject: vitest_1.vi.fn(),
        remove: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../partner-event.service", () => ({
    partnerEventService: {
        list: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/partners", partner_routes_1.partnerRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(partner_service_1.partnerService);
const events = vitest_1.vi.mocked(partner_event_service_1.partnerEventService);
const paginatedResponse = {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
};
(0, vitest_1.describe)("partnerRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a partner", async () => {
        service.create.mockResolvedValue({ id: "partner-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/partners")
            .send({ name: "Safari Adventures" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ createdById: "test-user" }));
    });
    (0, vitest_1.it)("lists partners", async () => {
        service.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/partners")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual(paginatedResponse);
    });
    (0, vitest_1.it)("returns a partner", async () => {
        service.getById.mockResolvedValue({ id: "partner-1", createdById: "test-user" });
        const res = await (0, supertest_1.default)(app).get("/api/partners/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ id: "partner-1", createdById: "test-user" });
    });
    (0, vitest_1.it)("returns 404 when partner missing", async () => {
        service.getById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/partners/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Partner not found" });
    });
    (0, vitest_1.it)("updates a partner", async () => {
        service.update.mockResolvedValue({ id: "partner-1", name: "Updated" });
        const res = await (0, supertest_1.default)(app)
            .patch("/api/partners/550e8400-e29b-41d4-a716-446655440000")
            .send({ name: "Updated" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.update).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ name: "Updated" }));
    });
    (0, vitest_1.it)("approves a partner", async () => {
        service.approve.mockResolvedValue({ id: "partner-1", approvalStatus: "APPROVED" });
        const res = await (0, supertest_1.default)(app).post("/api/partners/550e8400-e29b-41d4-a716-446655440000/approve");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.approve).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", "test-user");
    });
    (0, vitest_1.it)("rejects a partner", async () => {
        service.reject.mockResolvedValue({ id: "partner-1", approvalStatus: "REJECTED" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/partners/550e8400-e29b-41d4-a716-446655440000/reject")
            .send({ reason: "Incomplete docs" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.reject).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", "test-user", "Incomplete docs");
    });
    (0, vitest_1.it)("lists partner events", async () => {
        service.getById.mockResolvedValue({ id: "partner-1", createdById: "test-user" });
        events.list.mockResolvedValue(paginatedResponse);
        const res = await (0, supertest_1.default)(app)
            .get("/api/partners/550e8400-e29b-41d4-a716-446655440000/events")
            .query({ type: "APPROVED" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(events.list).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ partnerId: "550e8400-e29b-41d4-a716-446655440000", type: "APPROVED" }));
    });
    (0, vitest_1.it)("deletes a partner", async () => {
        service.remove.mockResolvedValue({
            id: 'partner-1',
            userId: 'user-1',
            businessName: 'Test Partner Ltd',
            website: null,
            description: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            approvalStatus: 'PENDING',
            approvedById: null,
            approvedAt: null,
            rejectedReason: null,
            serviceCategories: [],
            getAroundServices: [],
            verifiedStaysServices: [],
            liveLikeLocalServices: [],
            expertAccessServices: [],
            gearUpServices: [],
            getEntertainedServices: [],
            user: {
                id: 'user-1',
                name: 'Test User',
                email: 'test@example.com',
                emailVerified: false,
                emailVerifiedAt: null,
                password: 'hashed',
                phone: null,
                phoneVerified: false,
                phoneVerifiedAt: null,
                role: 'PARTNER',
                partnerId: null,
                idNumber: null,
                idType: null,
                profilePicUrl: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        const res = await (0, supertest_1.default)(app).delete("/api/partners/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(204);
        (0, vitest_1.expect)(service.remove).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
});
//# sourceMappingURL=partner.routes.spec.js.map