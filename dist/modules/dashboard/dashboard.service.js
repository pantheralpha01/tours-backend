"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const TREND_WINDOW_DAYS = 14;
const getTrendStartDate = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (TREND_WINDOW_DAYS - 1));
    return start;
};
const normalizeTrend = (rows, start) => {
    const lookup = new Map();
    rows.forEach((row) => {
        const normalizedDate = typeof row.day === "string" ? new Date(row.day) : row.day;
        const key = normalizedDate.toISOString().slice(0, 10);
        lookup.set(key, Number(row.count));
    });
    return Array.from({ length: TREND_WINDOW_DAYS }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const key = date.toISOString().slice(0, 10);
        return {
            date: key,
            value: lookup.get(key) ?? 0,
        };
    });
};
async function bookingsTrend(agentId, role, startDate) {
    const rows = await prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Booking"
      WHERE "createdAt" >= ${startDate}
      ${role === "AGENT" && agentId ? client_1.Prisma.sql `AND "agentId" = ${agentId}` : client_1.Prisma.empty}
      GROUP BY day
      ORDER BY day ASC
    `);
    return normalizeTrend(rows, startDate);
}
async function partnersTrend(agentId, role, startDate) {
    const rows = await prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Partner"
      WHERE "createdAt" >= ${startDate}
      ${role === "AGENT" && agentId ? client_1.Prisma.sql `AND "createdById" = ${agentId}` : client_1.Prisma.empty}
      GROUP BY day
      ORDER BY day ASC
    `);
    return normalizeTrend(rows, startDate);
}
async function disputesTrend(agentId, role, startDate) {
    const rows = await prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Dispute"
      WHERE "createdAt" >= ${startDate}
      ${role === "AGENT" && agentId
        ? client_1.Prisma.sql `AND ("openedById" = ${agentId} OR "assignedToId" = ${agentId})`
        : client_1.Prisma.empty}
      GROUP BY day
      ORDER BY day ASC
    `);
    return normalizeTrend(rows, startDate);
}
exports.dashboardService = {
    async getSummary({ agentId, role }) {
        const trendStart = getTrendStartDate();
        const bookingWhere = {
            status: { in: [client_1.BookingStatus.DRAFT, client_1.BookingStatus.CONFIRMED] },
        };
        if (role === "AGENT" && agentId) {
            bookingWhere.agentId = agentId;
        }
        const partnerWhere = {
            approvalStatus: client_1.PartnerApprovalStatus.PENDING,
        };
        const disputeWhere = {
            status: { in: [client_1.DisputeStatus.OPEN, client_1.DisputeStatus.UNDER_REVIEW] },
        };
        if (role === "AGENT" && agentId) {
            disputeWhere.OR = [{ openedById: agentId }, { assignedToId: agentId }];
        }
        const [bookingsInProgress, pendingPartnerApprovals, openDisputes, bookingsTrendSeries, partnersTrendSeries, disputesTrendSeries,] = await Promise.all([
            prisma_1.prisma.booking.count({ where: bookingWhere }),
            prisma_1.prisma.partner.count({ where: partnerWhere }),
            prisma_1.prisma.dispute.count({ where: disputeWhere }),
            bookingsTrend(agentId, role, trendStart),
            partnersTrend(agentId, role, trendStart),
            disputesTrend(agentId, role, trendStart),
        ]);
        return {
            bookingsInProgress,
            pendingPartnerApprovals,
            openDisputes,
            generatedAt: new Date().toISOString(),
            bookingsTrend: bookingsTrendSeries,
            partnersTrend: partnersTrendSeries,
            disputesTrend: disputesTrendSeries,
        };
    },
};
//# sourceMappingURL=dashboard.service.js.map