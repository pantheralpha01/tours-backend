import request from "supertest";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../../middleware/errorHandler";
import { notFoundHandler } from "../../../middleware/notFound";
import { authRoutes } from "../auth.routes";
import { authService } from "../auth.service";
import { userRepository } from "../../users/user.repository";

vi.mock("../auth.service", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("../../users/user.repository", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

const app = buildApp();
const service = vi.mocked(authService);
const users = vi.mocked(userRepository);

describe("authRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user", async () => {
    service.register.mockResolvedValue({ accessToken: "a", refreshToken: "b" } as any);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Jane", email: "jane@example.com", password: "Secret123", role: "AGENT" });

    expect(res.status).toBe(201);
    expect(service.register).toHaveBeenCalled();
  });

  it("logins a user", async () => {
    service.login.mockResolvedValue({ accessToken: "token" } as any);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@example.com", password: "Secret123" });

    expect(res.status).toBe(200);
    expect(service.login).toHaveBeenCalledWith(
      expect.objectContaining({ email: "jane@example.com" })
    );
  });

  it("refreshes tokens", async () => {
    service.refresh.mockResolvedValue({ accessToken: "new" } as any);

    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "refresh" });

    expect(res.status).toBe(200);
    expect(service.refresh).toHaveBeenCalledWith("refresh");
  });

  it("logs out a user", async () => {
    service.logout.mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken: "refresh" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logged out successfully" });
    expect(service.logout).toHaveBeenCalledWith("refresh");
  });

  it("returns authenticated user profile", async () => {
    users.findById.mockResolvedValue({
      id: "test-user",
      name: "Test User",
      email: "test@example.com",
      role: "ADMIN",
      isActive: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    } as any);

    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "test-user", email: "test@example.com" });
  });

  it("returns 404 when user missing", async () => {
    users.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "User not found" });
  });
});
