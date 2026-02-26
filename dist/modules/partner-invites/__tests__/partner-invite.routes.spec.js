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
const partner_invite_routes_1 = require("../partner-invite.routes");
const partner_invite_service_1 = require("../partner-invite.service");
vitest_1.vi.mock("../partner-invite.service", () => ({
    partnerInviteService: {
        create: vitest_1.vi.fn(),
        list: vitest_1.vi.fn(),
        accept: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/partners/invites", partner_invite_routes_1.partnerInviteRoutes);
    app.use("/api/public/partner-invites", partner_invite_routes_1.partnerInvitePublicRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(partner_invite_service_1.partnerInviteService);
(0, vitest_1.describe)("partnerInviteRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("creates an invite", async () => {
        service.create.mockResolvedValue({ id: "invite-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/partners/invites")
            .send({ companyName: "Acme", email: "team@acme.com" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ invitedById: "test-user" }));
    });
    (0, vitest_1.it)("lists invites", async () => {
        service.list.mockResolvedValue({ data: [], meta: {} });
        const res = await (0, supertest_1.default)(app)
            .get("/api/partners/invites")
            .query({ page: "2", limit: "5" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.list).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ page: 2, limit: 5 }));
    });
    (0, vitest_1.it)("accepts an invite publicly", async () => {
        service.accept.mockResolvedValue({ id: "invite-1" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/public/partner-invites/token-123/accept")
            .send({ contactName: "Jane" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.message).toBe("Invite accepted");
        (0, vitest_1.expect)(service.accept).toHaveBeenCalledWith("token-123", vitest_1.expect.objectContaining({ contactName: "Jane" }));
    });
});
//# sourceMappingURL=partner-invite.routes.spec.js.map