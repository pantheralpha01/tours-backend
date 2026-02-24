import { config } from "../../config";
import { notificationService } from "./notification.service";

const SCHEDULER_LABEL = "[NotificationScheduler]";

let timer: NodeJS.Timeout | null = null;
let running = false;

const runCycle = async () => {
  if (running) {
    return;
  }

  running = true;
  try {
    const processed = await notificationService.processDueJobs();
    if (processed > 0) {
      console.info(`${SCHEDULER_LABEL} processed ${processed} jobs`);
    }
  } catch (error) {
    console.error(`${SCHEDULER_LABEL} cycle error`, error);
  } finally {
    running = false;
  }
};

export const notificationScheduler = {
  start: () => {
    if (timer) {
      return;
    }
    const interval = config.notificationScheduler.intervalMs;
    timer = setInterval(runCycle, interval);
    console.info(
      `${SCHEDULER_LABEL} started with interval ${interval}ms and batch size ${config.notificationScheduler.batchSize}`
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
