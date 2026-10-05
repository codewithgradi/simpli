using simpli.Domain;
using simpli.Domain.Entities;

public interface IVisitorRepo
{
    Task<VisitorAndQrCodeDataDto> CheckIn(Visitor visitor, int companyId, int roomId);
    Task CheckOut(Visitor visitor);
    Task<Visitor> GetVisitor(int id);
    Task<List<Visitor>> GetAllVisitors(GetVisitorsQueryParameters query, int companyID);
}