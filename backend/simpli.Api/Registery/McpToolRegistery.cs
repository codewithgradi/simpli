using Microsoft.Extensions.AI;
using simpli.Api.Mcp;

public class McpToolRegistery
{
    private readonly List<AITool> _aiTools = new ();
    public McpToolRegistery( RoomTools roomTools,
        CompanyTools companyTools,
        VisitorTools visitorTools,
        NotificationTools notificationTools)
    {
        _aiTools.AddRange(AIFunctionFactory.Create(companyTools.SoftDeleteCompanyProfileMcp));
        _aiTools.AddRange(AIFunctionFactory.Create(roomTools.GetAllRoomsMcp));
        _aiTools.AddRange(AIFunctionFactory.Create(visitorTools.CheckOutMcp));
        _aiTools.AddRange(AIFunctionFactory.Create(visitorTools.GetAllVisitorsMcp));
        _aiTools.AddRange(AIFunctionFactory.Create(visitorTools.GetVisitorMcp));
        _aiTools.AddRange(AIFunctionFactory.Create(notificationTools.ClearNotificationMcp));
    }
    public List<AITool> Gettools()=>_aiTools;
    
}