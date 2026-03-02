import cors from "cors";

export const corsMiddleware = cors({
  origin: true, // Allow all origins for development/testing
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
