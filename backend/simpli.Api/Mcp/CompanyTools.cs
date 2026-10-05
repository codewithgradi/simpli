using System.ComponentModel;
using ModelContextProtocol.Server;
using simpli.Application.Services;

namespace simpli.Api.Mcp;

[McpServerToolType]
public class CompanyTools
{
    private readonly IServiceProvider _provider;

    public CompanyTools(IServiceProvider provider)
    {
        _provider = provider;
    }
    [McpServerTool(Name="update_company_details"),
    Description("This will soft delete company profile by setting the isDeleted property to true")]
    public async Task SoftDeleteCompanyProfileMcp(
        [Description("This is company id from database")]
        int companyId
    )
    {
        await using var scope =  _provider.CreateAsyncScope();
        var companyService =  scope.ServiceProvider.GetRequiredService<CompanyService>();
        await companyService.SoftDeleteCompanyProfile(companyId);
    }
}