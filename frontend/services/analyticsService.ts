import { apiClient } from "@/context/apiClient";
export interface DailyVisitorTrendDto {
  dateLabel: string;
  visitorCount: number;
}

export interface ReasonBreakdownDto {
  reason: string;
  count: number;
}

export interface GenderDistributionDto {
  gender: string;
  count: number;
}

export interface DashboardAnalyticsDto {
  totalVisitorsToday: number;
  activeVisitorsNow: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  visitorTrends: DailyVisitorTrendDto[];
  visitsByReason: ReasonBreakdownDto[];
  genderDistribution: GenderDistributionDto[];
}

export const analyticsService = {
    async get():Promise<DashboardAnalyticsDto>{
        return apiClient.get("/api/analytics")
    }
}