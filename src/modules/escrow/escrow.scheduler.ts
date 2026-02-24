import { PayoutStatus } from "@prisma/client";
import { escrowRepository } from "./escrow.repository";
import { escrowService, extractReleaseAt } from "./escrow.service";
import { config } from "../../config";

const SCHEDULER_LABEL = "[EscrowScheduler]";
const RELEASABLE_STATUSES: ReadonlySet<PayoutStatus> = new Set([
  "PENDING",
  "APPROVED",
]);

const getIntervalMs = () => config.escrowScheduler.intervalMs ?? 60_000;
const getBatchSize = () => config.escrowScheduler.batchSize ?? 20;

type EscrowAccountWithPayouts = Awaited<
  ReturnType<typeof escrowRepository.findDueReleases>
>[number];

type PayoutWithReleaseDate = {
  payout: EscrowAccountWithPayouts["payouts"][number];
  releaseAt: Date | null;
};

let timer: NodeJS.Timeout | null = null;
let isRunning = false;

const filterDuePayouts = (
  account: EscrowAccountWithPayouts
): PayoutWithReleaseDate[] => {
  const now = Date.now();
  return (account.payouts ?? [])
    .map((payout) => ({ payout, releaseAt: extractReleaseAt(payout.metadata) }))
    .filter(({ payout }) => RELEASABLE_STATUSES.has(payout.status))
    .filter(({ releaseAt }) => !releaseAt || releaseAt.getTime() <= now)
    .sort((a, b) => {
      const aTime = a.releaseAt?.getTime() ?? 0;
      const bTime = b.releaseAt?.getTime() ?? 0;
      return aTime - bTime;
    });
};

const processAccountReleases = async (account: EscrowAccountWithPayouts) => {
  const duePayouts = filterDuePayouts(account);
  if (duePayouts.length === 0) {
    return;
  }

  for (const { payout, releaseAt } of duePayouts) {
    try {
      await escrowService.updatePayoutStatus({
        bookingId: payout.bookingId,
        payoutId: payout.id,
        status: "SENT",
        metadata: {
          trigger: "ESCROW_SCHEDULER",
          scheduledReleaseAt: releaseAt?.toISOString(),
        },
      });
      console.info(
        `${SCHEDULER_LABEL} Released payout ${payout.id} for booking ${payout.bookingId}`
      );
    } catch (error) {
      console.error(
        `${SCHEDULER_LABEL} Failed to release payout ${payout.id}:`,
        error
      );
    }
  }
};

const runCycle = async () => {
  if (isRunning) {
    return;
  }

  isRunning = true;
  try {
    const accounts = await escrowRepository.findDueReleases({
      limit: getBatchSize(),
    });

    for (const account of accounts) {
      await processAccountReleases(account);
    }
  } catch (error) {
    console.error(`${SCHEDULER_LABEL} Cycle failed`, error);
  } finally {
    isRunning = false;
  }
};

export const escrowScheduler = {
  start: () => {
    if (timer) {
      return;
    }
    const interval = getIntervalMs();
    timer = setInterval(runCycle, interval);
    console.info(
      `${SCHEDULER_LABEL} started with interval ${interval}ms and batch size ${getBatchSize()}`
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
  runCycle: () => runCycle(),
};
