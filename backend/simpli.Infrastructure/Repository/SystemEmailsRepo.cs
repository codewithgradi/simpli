using Microsoft.EntityFrameworkCore;
using simpli.Application;
using simpli.Application.Dtos;
using simpli.Application.Interfaces;
using simpli.Domain.Entities;

namespace simpli.Infrastructure.Repository;

public class SystemEmailsRepo : ISystemEmailsRepo
{
    private readonly AppDbContext _context;

    public SystemEmailsRepo(AppDbContext context)
    {
        _context =context;
    }
    public async Task<IEnumerable<SystemEmails>> GetAll(GeneralQuery query, int CompanyId)
    {
        IQueryable<SystemEmails> emails = _context.SystemEmails.Where(c=>c.CompanyId == CompanyId);
        if (!string.IsNullOrEmpty(query.SearchItem))
        {
            
            emails = emails.Where(x=>
            x.VisitorFullName.ToString()
            .Contains(
                query.SearchItem.ToString()
            ));

        }
        return emails
        .Skip(query.PageSize * (query.PageNumber - 1))
        .Take(query.PageSize);
    }

    public async Task<SystemEmails?> GetVisitorDetailsFromEmail(string visitorFullName, int companyId)
    {
        if (string.IsNullOrWhiteSpace(visitorFullName))
            return null;

        return await _context.SystemEmails
            .Where(x => x.CompanyId == companyId && x.VisitorFullName.Contains(visitorFullName))
            .FirstOrDefaultAsync();
    }

    public async Task<SystemEmails> Post(SystemEmails email, int CompanyId, int RoomId)
    {
        email.CompanyId = CompanyId;
        email.RoomId = RoomId;
        await _context.SystemEmails.AddAsync(email);
        _context.SaveChangesAsync();
        return email;
    }
}