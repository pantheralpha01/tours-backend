"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowScheduler = void 0;
const escrow_repository_1 = require("./escrow.repository");
const escrow_service_1 = require("./escrow.service");
const config_1 = require("../../config");
const SCHEDULER_LABEL = "[EscrowScheduler]";
const RELEASABLE_STATUSES = new Set([
    "PENDING",
    "APPROVED",
]);
const getIntervalMs = () => config_1.config.escrowScheduler.intervalMs ?? 60000;
const getBatchSize = () => config_1.config.escrowScheduler.batchSize ?? 20;
let timer = null;
let isRunning = false;
const filterDuePayouts = (account) => {
    const now = Date.now();
    return (account.payouts ?? [])
        .map((payout) => ({ payout, releaseAt: (0, escrow_service_1.extractReleaseAt)(payout.metadata) }))
        .filter(({ payout }) => RELEASABLE_STATUSES.has(payout.status))
        .filter(({ releaseAt }) => !releaseAt || releaseAt.getTime() <= now)
        .sort((a, b) => {
        const aTime = a.releaseAt?.getTime() ?? 0;
        const bTime = b.releaseAt?.getTime() ?? 0;
        return aTime - bTime;
    });
};
const processAccountReleases = async (account) => {
    const duePayouts = filterDuePayouts(account);
    if (duePayouts.length === 0) {
        return;
    }
    for (const { payout, releaseAt } of duePayouts) {
        try {
            await escrow_service_1.escrowService.updatePayoutStatus({
                bookingId: payout.bookingId,
                payoutId: payout.id,
                status: "SENT",
                metadata: {
                    trigger: "ESCROW_SCHEDULER",
                    scheduledReleaseAt: releaseAt?.toISOString(),
                },
            });
            console.info(`${SCHEDULER_LABEL} Released payout ${payout.id} for booking ${payout.bookingId}`);
        }
        catch (error) {
            console.error(`${SCHEDULER_LABEL} Failed to release payout ${payout.id}:`, error);
        }
    }
};
const runCycle = async () => {
    if (isRunning) {
        return;
    }
    isRunning = true;
    try {
        const accounts = await escrow_repository_1.escrowRepository.findDueReleases({
            limit: getBatchSize(),
        });
        for (const account of accounts) {
            await processAccountReleases(account);
        }
    }
    catch (error) {
        console.error(`${SCHEDULER_LABEL} Cycle failed`, error);
    }
    finally {
        isRunning = false;
    }
};
exports.escrowScheduler = {
    start: () => {
        if (timer) {
            return;
        }
        const interval = getIntervalMs();
        timer = setInterval(runCycle, interval);
        console.info(`${SCHEDULER_LABEL} started with interval ${interval}ms and batch size ${getBatchSize()}`);
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
//# sourceMappingURL=escrow.scheduler.js.map