import { config } from "../../config";
import { communityNotificationService } from "./community.notification.service";

const SCHEDULER_LABEL = "[CommunityDigestScheduler]";

let timer: NodeJS.Timeout | null = null;
let running = false;

const runCycle = async () => {
  if (running) {
    return;
  }

  running = true;
  try {
    const result = await communityNotificationService.sendDailyDigest({
      sinceHours: config.community.digestScheduler.sinceHours,
      actorId: "community-digest-scheduler",
    });
    if (result.scheduled > 0) {
      console.info(
        `${SCHEDULER_LABEL} scheduled ${result.scheduled} digest notifications (since ${result.since.toISOString()})`
      );
    }
  } catch (error) {
    console.error(`${SCHEDULER_LABEL} cycle error`, error);
  } finally {
    running = false;
  }
};

export const communityDigestScheduler = {
  start: () => {
    if (timer) {
      return;
    }
    const interval = config.community.digestScheduler.intervalMs;
    timer = setInterval(runCycle, interval);
    console.info(
      `${SCHEDULER_LABEL} started with interval ${interval}ms (sinceHours=${config.community.digestScheduler.sinceHours})`
    );
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
