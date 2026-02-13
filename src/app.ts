import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { corsMiddleware } from "./middleware/cors";
import { apiLimiter } from "./middleware/rateLimiter";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { swaggerSpec } from "./config/swagger";

export const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting
app.use("/api", apiLimiter);

// Health check
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

// API routes
app.use("/api", apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
