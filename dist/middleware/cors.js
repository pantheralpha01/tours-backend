"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const renderExternalUrl = process.env.RENDER_EXTERNAL_URL;
const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://localhost:3000",
    "https://localhost:4000",
];
if (renderExternalUrl) {
    defaultOrigins.push(renderExternalUrl);
}
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : defaultOrigins;
exports.corsMiddleware = (0, cors_1.default)({
    origin: true, // Allow all origins for development/testing
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
//# sourceMappingURL=cors.js.map