namespace simpli.Application.Dtos;

public class DashboardAnalyticsDto
{
    // --- KPI / Summary Cards ---
    public int TotalVisitorsToday { get; set; }
    public int ActiveVisitorsNow { get; set; }
    public int TotalRooms { get; set; }
    public int OccupiedRooms { get; set; }
    public int AvailableRooms { get; set; }

    // --- Line Graph: Visitor Trend (Last 7 Days) ---
    public List<DailyVisitorTrendDto> VisitorTrends { get; set; } = new();

    // --- Bar Graph: Visits Grouped by Reason ---
    public List<ReasonBreakdownDto> VisitsByReason { get; set; } = new();

    // --- Other Graph (Donut/Pie): Gender Distribution ---
    public List<GenderDistributionDto> GenderDistribution { get; set; } = new();
}

public class DailyVisitorTrendDto
{
    public string DateLabel { get; set; } = string.Empty; // e.g. "Oct 14"
    public int VisitorCount { get; set; }
}

public class ReasonBreakdownDto
{
    public string Reason { get; set; } = string.Empty; // e.g. "Meeting", "Delivery"
    public int Count { get; set; }
}

public class GenderDistributionDto
{
    public string Gender { get; set; } = string.Empty; // e.g. "Male", "Female"
    public int Count { get; set; }
}