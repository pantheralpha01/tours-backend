import { app } from "./app";
import { config } from "./config";
import { escrowScheduler } from "./modules/escrow/escrow.scheduler";
import { notificationScheduler } from "./modules/notifications/notification.scheduler";
import { communityDigestScheduler } from "./modules/community/community.scheduler";

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const startSchedulers = () => {
  if (config.escrowScheduler.enabled) {
    escrowScheduler.start();
  }
  if (config.notificationScheduler.enabled) {
    notificationScheduler.start();
  }
  if (config.community.digestScheduler.enabled) {
    communityDigestScheduler.start();
  }
};

const stopSchedulers = () => {
  if (config.escrowScheduler.enabled) {
    escrowScheduler.stop();
  }
  if (config.notificationScheduler.enabled) {
    notificationScheduler.stop();
  }
  if (config.community.digestScheduler.enabled) {
    communityDigestScheduler.stop();
  }
};

startSchedulers();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason);
  stopSchedulers();
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  stopSchedulers();
  server.close(() => process.exit(1));
});

const gracefulShutdown = (signal: NodeJS.Signals) => {
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
