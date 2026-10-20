using simpli.Application.Dtos;
using simpli.Domain;
 

namespace simpli.Application.Services;

public interface IAnalyticsService
{
    Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(int companyId, CancellationToken cancellationToken = default);
}

public class AnalyticsService : IAnalyticsService
{
    private readonly ICompanyRepo _companyRepo;
    private readonly IRoomRepo _roomRepo;
    private readonly IVisitorRepo _visitorRepo;

    public AnalyticsService(
        ICompanyRepo companyRepo,
        IRoomRepo roomRepo,
        IVisitorRepo visitorRepo)
    {
        _companyRepo = companyRepo;
        _roomRepo = roomRepo;
        _visitorRepo = visitorRepo;
    }

    public async Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(int companyId, CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;

       
        var rooms = await _roomRepo.GetAllRoomsStats(companyId);
        var visitors = await _visitorRepo.GetAllVisitorsStats(companyId);

        var roomsList = rooms.ToList();
        var visitorsList = visitors.ToList();

        var totalVisitorsToday = visitorsList.Count(v => v.CheckInTime.Date == today);
        var activeVisitorsNow = visitorsList.Count(v => v.Status == VisitorStatus.CheckedIn);
        var totalRooms = roomsList.Count;
        var occupiedRooms = roomsList.Count(r => r.Status == RoomStatus.Occupied);
        var availableRooms = roomsList.Count(r => r.Status == RoomStatus.Available);

        var startDate = today.AddDays(-6);
        var recentVisitors = visitorsList.Where(v => v.CheckInTime.Date >= startDate).ToList();

        var visitorTrends = Enumerable.Range(0, 7)
            .Select(i => startDate.AddDays(i))
            .Select(date => new DailyVisitorTrendDto
            {
                DateLabel = date.ToString("MMM dd"),
                VisitorCount = recentVisitors.Count(v => v.CheckInTime.Date == date)
            })
            .ToList();

        var visitsByReason = visitorsList
            .GroupBy(v => v.ReasonForVisit)
            .Select(g => new ReasonBreakdownDto
            {
                Reason = g.Key.ToString(),
                Count = g.Count()
            })
            .ToList();

        var genderDistribution = visitorsList
            .GroupBy(v => v.Gender)
            .Select(g => new GenderDistributionDto
            {
                Gender = g.Key.ToString(),
                Count = g.Count()
            })
            .ToList();

        return new DashboardAnalyticsDto
        {
            TotalVisitorsToday = totalVisitorsToday,
            ActiveVisitorsNow = activeVisitorsNow,
            TotalRooms = totalRooms,
            OccupiedRooms = occupiedRooms,
            AvailableRooms = availableRooms,
            VisitorTrends = visitorTrends,
            VisitsByReason = visitsByReason,
            GenderDistribution = genderDistribution
        };
    }
}