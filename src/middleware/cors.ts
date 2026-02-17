import cors from "cors";

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

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, Swagger UI)
    if (!origin) return callback(null, true);

    // Allow localhost on any port for development
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.startsWith("https://localhost:") ||
      origin.startsWith("https://127.0.0.1:")
    ) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
