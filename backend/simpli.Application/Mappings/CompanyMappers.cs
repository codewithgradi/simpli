using Riok.Mapperly.Abstractions;
using simpli.Domain.Entities;
namespace simpli.Application.Dtos;

using simpli.Domain;

[Mapper]
public partial class CompanyMappers
{
  public partial Company? MapToEntityFromCreate(CreateCompanyDto dto);
  public partial IQueryable<CompanyDto> ProjectToCompanyDto(IQueryable<Company> companies);
  public partial Company? MapToEntityFromUpdate(UpdateCompanyProfileDto dto);
  public partial CompanyDto MapToDto(Company entity);
  public partial CompanyDto? MapToDtoFromGet(Company company);
  public partial CompanyDto? MapToDtoFromUpdateProfile(UpdateCompanyProfileDto dto);
  public partial GetSystemEmailDto? MapToDtoFromGetEmail(SystemEmails email);

  public partial SystemEmails? MapToEntityFromEmail(PostSystemEmailDto email);

}
