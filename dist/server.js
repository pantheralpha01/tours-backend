"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const server = app_1.app.listen(config_1.config.port, () => {
    console.log(`Server running on port ${config_1.config.port}`);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    server.close(() => process.exit(1));
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("Process terminated");
    });
});
//# sourceMappingURL=server.js.map