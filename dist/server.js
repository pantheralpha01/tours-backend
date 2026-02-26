"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const escrow_scheduler_1 = require("./modules/escrow/escrow.scheduler");
const notification_scheduler_1 = require("./modules/notifications/notification.scheduler");
const community_scheduler_1 = require("./modules/community/community.scheduler");
const server = app_1.app.listen(config_1.config.port, () => {
    console.log(`Server running on port ${config_1.config.port}`);
});
const startSchedulers = () => {
    if (config_1.config.escrowScheduler.enabled) {
        escrow_scheduler_1.escrowScheduler.start();
    }
    if (config_1.config.notificationScheduler.enabled) {
        notification_scheduler_1.notificationScheduler.start();
    }
    if (config_1.config.community.digestScheduler.enabled) {
        community_scheduler_1.communityDigestScheduler.start();
    }
};
const stopSchedulers = () => {
    if (config_1.config.escrowScheduler.enabled) {
        escrow_scheduler_1.escrowScheduler.stop();
    }
    if (config_1.config.notificationScheduler.enabled) {
        notification_scheduler_1.notificationScheduler.stop();
    }
    if (config_1.config.community.digestScheduler.enabled) {
        community_scheduler_1.communityDigestScheduler.stop();
    }
};
startSchedulers();
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    stopSchedulers();
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    stopSchedulers();
    server.close(() => process.exit(1));
});
const gracefulShutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    stopSchedulers();
    server.close(() => {
        console.log("Process terminated");
        process.exit(0);
    });
};
// Graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
//# sourceMappingURL=server.js.map