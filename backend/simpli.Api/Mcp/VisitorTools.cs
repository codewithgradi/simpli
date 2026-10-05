using System.ComponentModel;
using ModelContextProtocol.Server;
using simpli.Application.Services;
using simpli.Domain.Entities;

namespace simpli.Api.Mcp
{
    [McpServerToolType]
    public class VisitorTools
    {
        private readonly IServiceProvider _provider;

        public VisitorTools(IServiceProvider provider)
        {
            _provider = provider;
        }
        [McpServerTool(Name ="get_all_visitors"), Description("Returns a list of all visitors")]
        public async Task<List<VisitorDto>> GetAllVisitorsMcp(
            [Description("this is the company id for which company the visitor is checked in at")]
            int companyId)
        {
            await using var scope = _provider.CreateAsyncScope();
            var service = scope.ServiceProvider.GetRequiredService<VisitorService>();
            var query = new GetVisitorsQueryParameters();
            var visitors = await service.GetAllVisitors(query, companyId);
            return visitors;
        }
        
        [McpServerTool(Name="get_one_visitor"), Description("Returns on visitor from visitors table")]
        public async Task<VisitorDto> GetVisitorMcp([Description("This is visitor id")]int id)
        {
            using var scope = _provider.CreateAsyncScope();
            var service = scope.ServiceProvider.GetRequiredService<VisitorService>();
            var visitor = await service.GetVisitor(id);
            return visitor;
        }
        [McpServerTool(Name="check_out_visitor"), Description("This function checks out a visitor.")]
        public async Task CheckOutMcp(
            [Description("This has room id and passcode in the obeject being passed as variable")]
             CheckOutDto dto)
        {
            await using var scope = _provider.CreateAsyncScope();
            var service = scope.ServiceProvider.GetRequiredService<VisitorService>();
            await service.CheckOut(dto);
        }
    }
}