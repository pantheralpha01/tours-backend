import { Role } from "@prisma/client";
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
export declare const dashboardService: {
    getSummary({ agentId, role }: DashboardSummaryFilters): Promise<DashboardSummary>;
};
export {};
//# sourceMappingURL=dashboard.service.d.ts.map