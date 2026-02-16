"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:4000"];
exports.corsMiddleware = (0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, Swagger UI)
        if (!origin)
            return callback(null, true);
        // Allow localhost on any port for development
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
//# sourceMappingURL=cors.js.map