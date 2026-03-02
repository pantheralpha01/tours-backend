import {
  BookingStatus,
  DisputeStatus,
  PartnerApprovalStatus,
  Prisma,
  Role,
} from "@prisma/client";
import { prisma } from "../../config/prisma";

interface DashboardSummaryFilters {
  agentId?: string;
  role: Role;
}

export interface DashboardSummary {
  bookingsInProgress: number;
  pendingPartnerApprovals: number;
  openDisputes: number;
  generatedAt: string;
  bookingsTrend: TrendPoint[];
  partnersTrend: TrendPoint[];
  disputesTrend: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

const TREND_WINDOW_DAYS = 14;

const getTrendStartDate = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (TREND_WINDOW_DAYS - 1));
  return start;
};

const normalizeTrend = (rows: { day: Date | string; count: number }[], start: Date): TrendPoint[] => {
  const lookup = new Map<string, number>();
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

async function bookingsTrend(agentId: string | undefined, role: Role, startDate: Date) {
  const rows = await prisma.$queryRaw<Array<{ day: Date | string; count: number }>>(
    Prisma.sql`
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Booking"
      WHERE "createdAt" >= ${startDate}
      ${role === "AGENT" && agentId ? Prisma.sql`AND "agentId" = ${agentId}` : Prisma.empty}
      GROUP BY day
      ORDER BY day ASC
    `
  );
  return normalizeTrend(rows, startDate);
}

async function partnersTrend(agentId: string | undefined, role: Role, startDate: Date) {
  const rows = await prisma.$queryRaw<Array<{ day: Date | string; count: number }>>(
    Prisma.sql`
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Partner"
      WHERE "createdAt" >= ${startDate}
      ${role === "AGENT" && agentId ? Prisma.sql`AND "createdById" = ${agentId}` : Prisma.empty}
      GROUP BY day
      ORDER BY day ASC
    `
  );
  return normalizeTrend(rows, startDate);
}

async function disputesTrend(agentId: string | undefined, role: Role, startDate: Date) {
  const rows = await prisma.$queryRaw<Array<{ day: Date | string; count: number }>>(
    Prisma.sql`
      SELECT date("createdAt") as day, COUNT(*)::int as count
      FROM "Dispute"
      WHERE "createdAt" >= ${startDate}
      ${
        role === "AGENT" && agentId
          ? Prisma.sql`AND ("openedById" = ${agentId} OR "assignedToId" = ${agentId})`
          : Prisma.empty
      }
      GROUP BY day
      ORDER BY day ASC
    `
  );
  return normalizeTrend(rows, startDate);
}

export const dashboardService = {
  async getSummary({ agentId, role }: DashboardSummaryFilters): Promise<DashboardSummary> {
    const trendStart = getTrendStartDate();

    const bookingWhere: Prisma.BookingWhereInput = {
      status: { in: [BookingStatus.DRAFT, BookingStatus.CONFIRMED] },
    };

    if (role === "AGENT" && agentId) {
      bookingWhere.agentId = agentId;
    }
    const partnerWhere: Prisma.PartnerWhereInput = {
      approvalStatus: PartnerApprovalStatus.PENDING,
    };

    const disputeWhere: Prisma.DisputeWhereInput = {
      status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW] },
    };

    if (role === "AGENT" && agentId) {
      disputeWhere.OR = [{ openedById: agentId }, { assignedToId: agentId }];
    }

    const [
      bookingsInProgress,
      pendingPartnerApprovals,
      openDisputes,
      bookingsTrendSeries,
      partnersTrendSeries,
      disputesTrendSeries,
    ] = await Promise.all([
      prisma.booking.count({ where: bookingWhere }),
      prisma.partner.count({ where: partnerWhere }),
      prisma.dispute.count({ where: disputeWhere }),
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
