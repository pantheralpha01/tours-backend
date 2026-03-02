"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = require("./middleware/cors");
const rateLimiter_1 = require("./middleware/rateLimiter");
const routes_1 = require("./routes");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const swagger_1 = require("./config/swagger");
exports.app = (0, express_1.default)();
// Respect proxy headers (needed on Render/other platforms for rate limiting & IPs)
exports.app.set("trust proxy", 1);
// Security middleware
// Disable CSP for Swagger UI to work properly (can be relaxed in production)
exports.app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
exports.app.use(cors_1.corsMiddleware);
// Logging
exports.app.use((0, morgan_1.default)("combined"));
// Body parsing
exports.app.use(express_1.default.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf.toString();
    },
}));
exports.app.use(express_1.default.urlencoded({ extended: true }));
// API Documentation
exports.app.get("/swagger.json", (_req, res) => res.json(swagger_1.swaggerSpec));
exports.app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Rate limiting
exports.app.use("/api", rateLimiter_1.apiLimiter);
// Health check
exports.app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
// API routes
exports.app.use("/api", routes_1.apiRouter);
// Error handling
exports.app.use(notFound_1.notFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map