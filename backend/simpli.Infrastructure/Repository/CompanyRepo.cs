using Microsoft.EntityFrameworkCore;
using simpli.Domain;
using simpli.Domain.Exceptions;
public class CompanyRepo : ICompanyRepo
{
    private readonly AppDbContext _context;
    public CompanyRepo(AppDbContext context)
    {
        _context = context;
    }
    public Task<bool> CompanyExists(int companyId)
    {
        return _context.Companies.AnyAsync(x => x.Id == companyId);
    }

    public async Task<Company> GetCompanyProfile(int companyId)
    {
        var company = await _context
        .Companies
        .Include(x => x.User)
        .Include(r => r.Rooms)
        .Include(v => v.Visitors)
        .FirstOrDefaultAsync(x => x.Id == companyId);
        if (company == null) return null;
        return company;
    }

    public async Task<Company> CreateCompany(Company company, string userId)
    {
        company.AppUserId = userId;
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();
        return company;
    }

    public async Task ReactivateProfile(int companyId)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(x => x.Id == companyId);
        if (company == null) return;
        company.isDeleted = false;
        await _context.SaveChangesAsync();
    }

    public async Task SoftDeleteCompanyProfile(int companyId)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(x => x.Id == companyId);
        if (company == null) return;
        company.isDeleted = true;
        await _context.SaveChangesAsync();
    }

    public async Task<Company> UpdateCompanyProfile(int companyId, Company updatedCompany)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(x => x.Id == companyId);
        if (company == null) return null;
        company.Address = updatedCompany.Address;
        company.CompanyName = updatedCompany.CompanyName;
        company.ContactNumber = updatedCompany.ContactNumber;
        company.RegistrationNumber = updatedCompany.RegistrationNumber;
        company.Website = updatedCompany.Website;
        company.Address = updatedCompany.Address;
        company.isProfileComplete = true;
        await _context.SaveChangesAsync();
        return company;
    }

    public async Task<int> GetCompanyId(string AppUserId)
    {
        return await _context.Companies
        .Where(x => x.AppUserId == AppUserId)
        .Select(x => x.Id)
        .FirstOrDefaultAsync();
    }

    public async Task<bool> isActivate(int companyId)
    {
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
        if (company == null)
        {
            throw new ResourceNotFoundException("Company was not found");
        }
        ;
        return company.isDeleted;
    }
}