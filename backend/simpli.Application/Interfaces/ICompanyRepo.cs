using simpli.Domain;

public interface ICompanyRepo
{
    Task<Company> GetCompanyProfile(int companyId);
    Task<Company> CreateCompany(Company company, string userId);
    Task<Company> UpdateCompanyProfile(int comapnyId, Company company);
    Task SoftDeleteCompanyProfile(int companyId);
    Task ReactivateProfile(int companyId);
    Task<bool> CompanyExists(int companyId);
    Task<int> GetCompanyId(string AppUserId);
    Task<bool> isActivate(int companyId);
}