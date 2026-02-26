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
const auth_routes_1 = require("../auth.routes");
const auth_service_1 = require("../auth.service");
const user_repository_1 = require("../../users/user.repository");
vitest_1.vi.mock("../auth.service", () => ({
    authService: {
        register: vitest_1.vi.fn(),
        login: vitest_1.vi.fn(),
        refresh: vitest_1.vi.fn(),
        logout: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../../users/user.repository", () => ({
    userRepository: {
        findById: vitest_1.vi.fn(),
    },
}));
const buildApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/auth", auth_routes_1.authRoutes);
    app.use(notFound_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
const app = buildApp();
const service = vitest_1.vi.mocked(auth_service_1.authService);
const users = vitest_1.vi.mocked(user_repository_1.userRepository);
(0, vitest_1.describe)("authRoutes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("registers a user", async () => {
        service.register.mockResolvedValue({ accessToken: "a", refreshToken: "b" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/auth/register")
            .send({ name: "Jane", email: "jane@example.com", password: "Secret123", role: "AGENT" });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(service.register).toHaveBeenCalled();
    });
    (0, vitest_1.it)("logins a user", async () => {
        service.login.mockResolvedValue({ accessToken: "token" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/auth/login")
            .send({ email: "jane@example.com", password: "Secret123" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.login).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ email: "jane@example.com" }));
    });
    (0, vitest_1.it)("refreshes tokens", async () => {
        service.refresh.mockResolvedValue({ accessToken: "new" });
        const res = await (0, supertest_1.default)(app)
            .post("/api/auth/refresh")
            .send({ refreshToken: "refresh" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(service.refresh).toHaveBeenCalledWith("refresh");
    });
    (0, vitest_1.it)("logs out a user", async () => {
        service.logout.mockResolvedValue(undefined);
        const res = await (0, supertest_1.default)(app)
            .post("/api/auth/logout")
            .send({ refreshToken: "refresh" });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ message: "Logged out successfully" });
        (0, vitest_1.expect)(service.logout).toHaveBeenCalledWith("refresh");
    });
    (0, vitest_1.it)("returns authenticated user profile", async () => {
        users.findById.mockResolvedValue({
            id: "test-user",
            name: "Test User",
            email: "test@example.com",
            role: "ADMIN",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
        });
        const res = await (0, supertest_1.default)(app).get("/api/auth/me");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toMatchObject({ id: "test-user", email: "test@example.com" });
    });
    (0, vitest_1.it)("returns 404 when user missing", async () => {
        users.findById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get("/api/auth/me");
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.body).toEqual({ message: "User not found" });
    });
});
//# sourceMappingURL=auth.routes.spec.js.map