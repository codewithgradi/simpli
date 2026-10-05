using Riok.Mapperly.Abstractions;
using simpli.Domain;
using simpli.Domain.Entities;
namespace simpli.Application.Dtos;


[Mapper]
public partial class VisitorMappers
{
  public partial Visitor MapToEntityFromCheckIn(CheckInDto dto);
  public partial Visitor MapToEntityFromCheckOut(CheckOutDto dto);
  public partial IQueryable<CheckInDto> ProjectToCheckInDto(IQueryable<Visitor> query);
  public partial VisitorDto MapToDto(Visitor visitor);
  public partial Visitor MapToEntity(VisitorDto visitor);
  public partial VisitorDto MapToDtoFromCreate(CreateCompanyDto dto);
}