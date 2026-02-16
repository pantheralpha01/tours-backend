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
// Security middleware
exports.app.use((0, helmet_1.default)());
exports.app.use(cors_1.corsMiddleware);
// Logging
exports.app.use((0, morgan_1.default)("combined"));
// Body parsing
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// API Documentation
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