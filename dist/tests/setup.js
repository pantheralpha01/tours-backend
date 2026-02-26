"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock("../middleware/auth", () => ({
    authenticate: (req, _res, next) => {
        if (!req.user) {
            req.user = { id: "test-user", role: "ADMIN" };
        }
        next();
    },
}));
vitest_1.vi.mock("../utils/jwt", () => ({
    verifyAccessToken: vitest_1.vi.fn(() => ({ sub: "test-user", role: "ADMIN" })),
    signAccessToken: vitest_1.vi.fn(() => "test-access-token"),
    signRefreshToken: vitest_1.vi.fn(() => "test-refresh-token"),
}));
//# sourceMappingURL=setup.js.map