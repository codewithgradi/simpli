using System.ComponentModel;
using ModelContextProtocol.Server;
using simpli.Application.Services;

namespace simpli.Api.Mcp;
[McpServerToolType]
public class NotificationTools
{
    private readonly IServiceProvider _provider;

    public NotificationTools(IServiceProvider provider)
    {
        _provider = provider;
    }
    [McpServerTool(Name ="clear_all_notifications"), Description("This deletes all notifications for a company based on the company id")]
    public async Task ClearNotificationMcp(
        [Description("This is the company id saved on the database.")]
        int companyId)
    {
        await using var scope = _provider.CreateAsyncScope();  
        var service = scope.ServiceProvider.GetRequiredService<NotificationService>();
        await service.ClearAllNotifications(companyId);
    }
    

}