"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationScheduler = void 0;
const config_1 = require("../../config");
const notification_service_1 = require("./notification.service");
const SCHEDULER_LABEL = "[NotificationScheduler]";
let timer = null;
let running = false;
const runCycle = async () => {
    if (running) {
        return;
    }
    running = true;
    try {
        const processed = await notification_service_1.notificationService.processDueJobs();
        if (processed > 0) {
            console.info(`${SCHEDULER_LABEL} processed ${processed} jobs`);
        }
    }
    catch (error) {
        console.error(`${SCHEDULER_LABEL} cycle error`, error);
    }
    finally {
        running = false;
    }
};
exports.notificationScheduler = {
    start: () => {
        if (timer) {
            return;
        }
        const interval = config_1.config.notificationScheduler.intervalMs;
        timer = setInterval(runCycle, interval);
        console.info(`${SCHEDULER_LABEL} started with interval ${interval}ms and batch size ${config_1.config.notificationScheduler.batchSize}`);
        void runCycle();
    },
    stop: () => {
        if (!timer) {
            return;
        }
        clearInterval(timer);
        timer = null;
        console.info(`${SCHEDULER_LABEL} stopped`);
    },
    runCycle,
};
//# sourceMappingURL=notification.scheduler.js.map