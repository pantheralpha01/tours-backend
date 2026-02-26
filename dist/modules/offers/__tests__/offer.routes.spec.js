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
const offer_routes_1 = require("../offer.routes");
const offer_service_1 = require("../offer.service");
vitest_1.vi.mock("../offer.service", () => ({
    offerService: {
        createTemplate: vitest_1.vi.fn(),
        listTemplates: vitest_1.vi.fn(),
        getTemplateById: vitest_1.vi.fn(),
        calculatePrice: vitest_1.vi.fn(),
        createProposal: vitest_1.vi.fn(),
        listProposals: vitest_1.vi.fn(),
        getProposalById: vitest_1.vi.fn(),
        generateAssetsForProposal: vitest_1.vi.fn(),
        generateContract: vitest_1.vi.fn(),
        approveProposal: vitest_1.vi.fn(),
        publishProposal: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/offers", offer_routes_1.offerRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(offer_service_1.offerService);
(0, vitest_1.describe)("offerRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates a template", async () => {
        service.createTemplate.mockResolvedValue({ id: "tmpl-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/templates")
            .send({ name: "Standard", slug: "standard", baseAmount: 1000 });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.createTemplate).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ name: "Standard", actorId: "test-user" }));
    });
    (0, vitest_1.it)("lists templates", async () => {
        service.listTemplates.mockResolvedValue({ data: [], meta: {} });
        const res = await (0, supertest_1.default)(app).get("/api/offers/templates");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.listTemplates).toHaveBeenCalled();
    });
    (0, vitest_1.it)("fetches a template", async () => {
        service.getTemplateById.mockResolvedValue({ id: "tmpl-1" });
        const res = await (0, supertest_1.default)(app).get("/api/offers/templates/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.getTemplateById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("returns 404 when template missing", async () => {
        service.getTemplateById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/offers/templates/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Template not found" });
    });
    (0, vitest_1.it)("calculates price", async () => {
        service.calculatePrice.mockReturnValue({ total: 1200 });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/calculate")
            .send({ baseAmount: 1000 });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ total: 1200 });
    });
    (0, vitest_1.it)("creates a proposal", async () => {
        service.createProposal.mockResolvedValue({ id: "prop-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/proposals")
            .send({ baseAmount: 1000, bookingId: "550e8400-e29b-41d4-a716-446655440000" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.createProposal).toHaveBeenCalled();
    });
    (0, vitest_1.it)("lists proposals", async () => {
        service.listProposals.mockResolvedValue({ data: [], meta: {} });
        const res = await (0, supertest_1.default)(app)
            .get("/api/offers/proposals")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.listProposals).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 5 }));
    });
    (0, vitest_1.it)("gets a proposal", async () => {
        service.getProposalById.mockResolvedValue({ id: "prop-1" });
        const res = await (0, supertest_1.default)(app).get("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.getProposalById).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("generates proposal assets", async () => {
        service.generateAssetsForProposal.mockResolvedValue({ id: "prop-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/assets")
            .query({ logo: "false" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.generateAssetsForProposal).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", { logo: false, signature: true });
    });
    (0, vitest_1.it)("generates a contract", async () => {
        service.generateContract.mockResolvedValue({ id: "prop-1", contractUrl: "url" });
        const res = await (0, supertest_1.default)(app).post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/contract");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.generateContract).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    });
    (0, vitest_1.it)("approves a proposal", async () => {
        service.approveProposal.mockResolvedValue({ id: "prop-1", status: "APPROVED" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/approve")
            .send({ notes: "Looks good" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.approveProposal).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ actorId: "test-user", notes: "Looks good" }));
    });
    (0, vitest_1.it)("publishes a proposal", async () => {
        service.publishProposal.mockResolvedValue({ id: "prop-1", status: "PUBLISHED" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/offers/proposals/550e8400-e29b-41d4-a716-446655440000/publish")
            .send({ channel: "EMAIL" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.publishProposal).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", vitest_1.expect.objectContaining({ channel: "EMAIL", actorId: "test-user" }));
    });
});
//# sourceMappingURL=offer.routes.spec.js.map