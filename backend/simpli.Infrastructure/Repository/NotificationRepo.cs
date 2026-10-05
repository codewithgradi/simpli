using Microsoft.EntityFrameworkCore;
using simpli.Application.Dtos;
using simpli.Domain;
using simpli.Domain.Entities;

public class NotificationRepo : INotificationRepo
{
    private readonly AppDbContext _context;
    public NotificationRepo(AppDbContext context)
    {
        _context = context;

    }
    public async Task ClearAllNotifications(int companyId)
    {
        await _context.Notifications
        .Where(x => x.CompanyId == companyId)
       .ExecuteDeleteAsync();
    }

    public async Task<Notification> CreateNotification(Notification notif, int companyID)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyID);
        if (company == null) return null;
        notif.CompanyId = companyID;
        notif.CreatedAt = DateTime.UtcNow;
        var notification = await _context.Notifications.AddAsync(notif);
        if (notification == null) return null;
        await _context.SaveChangesAsync();
        return notif;
    }

    public async Task<List<Notification>> GetAllNotifications(int companyID, QueryParameters query)
    {
        IQueryable<Notification> notificationsQuery = _context.Notifications
             .Where(x => x.CompanyId == companyID);

        if (string.IsNullOrEmpty(query.SortBy))
        {
            bool fromLattest = query.SortBy.Equals("desc", StringComparison.OrdinalIgnoreCase);
            notificationsQuery = fromLattest ?
            notificationsQuery.OrderByDescending(v => v.CreatedAt)
            : notificationsQuery.OrderBy(v => v.CreatedAt);
        }
        else
        {
            notificationsQuery = notificationsQuery.OrderBy(v => v.Id);
        }


        return await notificationsQuery
            .Skip(query.Size * (query.Page - 1))
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<Notification> GetNotification(int id)
    {
        var notif = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notif == null) return null;
        return notif;
    }

    public async Task MarkAllRead(int companyId)
    {
        await _context.Notifications
        .Where(x => x.CompanyId == companyId)
        .ExecuteUpdateAsync(setters => setters.SetProperty(r => r.IsRead, true));
    }
}