using simpli.Application.Dtos;
using simpli.Domain.Entities;

namespace simpli.Application.Services;

public class CompanyService
{
  private readonly ICompanyRepo _companyRepo;
  private readonly CompanyMappers _mapper;

  public CompanyService(ICompanyRepo companyRepo, CompanyMappers mapper)
  {
    _companyRepo = companyRepo;
    _mapper = mapper;
  }
  public async Task<CompanyDto> GetCompanyProfile(int companyId)
  {
    var company = await _companyRepo.GetCompanyProfile(companyId);
    if (company == null) return null;
    return _mapper.MapToDto(company);
  }
  public async Task<CompanyDto> CreateCompany(CreateCompanyDto dto, string userId)
  {
    var entity = _mapper.MapToEntityFromCreate(dto);
    entity.AppUserId = userId;
    var company = await _companyRepo.CreateCompany(entity, userId);
    return _mapper.MapToDto(company);
  }
  public async Task<CompanyDto> UpdateCompanyProfile(int companyId, UpdateCompanyProfileDto dto)
  {
    var company = _mapper.MapToEntityFromUpdate(dto);
    company = await _companyRepo.UpdateCompanyProfile(companyId, company);
    return _mapper.MapToDto(company);
  }
  public async Task SoftDeleteCompanyProfile(int companyID)
  {
    var exists = await _companyRepo.GetCompanyProfile(companyID);
    if (exists == null) throw new KeyNotFoundException("Company was not found.");
    await _companyRepo.SoftDeleteCompanyProfile(companyID);
  }

  public async Task ReactivateProfile(int id)
  {
    var exists = await _companyRepo.GetCompanyProfile(id);
    if (exists == null) throw new KeyNotFoundException("Company was not found");
    await _companyRepo.ReactivateProfile(id);
  }

  public async Task<int> GetCompanyId(string AppUserId)
  {
    return await _companyRepo.GetCompanyId(AppUserId);
  }
}