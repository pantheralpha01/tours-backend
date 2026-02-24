import { vi } from "vitest";

vi.mock("../middleware/auth", () => ({
  authenticate: (req: any, _res: any, next: any) => {
    if (!req.user) {
      req.user = { id: "test-user", role: "ADMIN" };
    }
    next();
  },
}));

vi.mock("../utils/jwt", () => ({
  verifyAccessToken: vi.fn(() => ({ sub: "test-user", role: "ADMIN" })),
  signAccessToken: vi.fn(() => "test-access-token"),
  signRefreshToken: vi.fn(() => "test-refresh-token"),
}));
