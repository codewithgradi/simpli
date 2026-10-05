using simpli.Application.Dtos;
using simpli.Domain.Entities;

namespace simpli.Application.Interfaces;
public interface ISystemEmailsRepo
{
    Task<IEnumerable<SystemEmails>> GetAll(GeneralQuery query,int CompanyId);
    Task<SystemEmails> GetVisitorDetailsFromEmail(string VisitorFullName, int CompanyId);
    Task<SystemEmails> Post(SystemEmails email, int CompanyId, int RoomId);
}