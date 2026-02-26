"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityDigestScheduler = void 0;
const config_1 = require("../../config");
const community_notification_service_1 = require("./community.notification.service");
const SCHEDULER_LABEL = "[CommunityDigestScheduler]";
let timer = null;
let running = false;
const runCycle = async () => {
    if (running) {
        return;
    }
    running = true;
    try {
        const result = await community_notification_service_1.communityNotificationService.sendDailyDigest({
            sinceHours: config_1.config.community.digestScheduler.sinceHours,
            actorId: "community-digest-scheduler",
        });
        if (result.scheduled > 0) {
            console.info(`${SCHEDULER_LABEL} scheduled ${result.scheduled} digest notifications (since ${result.since.toISOString()})`);
        }
    }
    catch (error) {
        console.error(`${SCHEDULER_LABEL} cycle error`, error);
    }
    finally {
        running = false;
    }
};
exports.communityDigestScheduler = {
    start: () => {
        if (timer) {
            return;
        }
        const interval = config_1.config.community.digestScheduler.intervalMs;
        timer = setInterval(runCycle, interval);
        console.info(`${SCHEDULER_LABEL} started with interval ${interval}ms (sinceHours=${config_1.config.community.digestScheduler.sinceHours})`);
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
//# sourceMappingURL=community.scheduler.js.map