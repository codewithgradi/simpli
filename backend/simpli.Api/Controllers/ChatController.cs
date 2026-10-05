using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;
using simpli.Application.Dtos;

namespace simpli.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ChatController:ControllerBase
{
    private readonly IChatClient _chatClient;
    private readonly McpToolRegistery _toolRegistery;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        IChatClient chatClient,
        McpToolRegistery registery,
        ILogger<ChatController> logger
         )
    {
        _chatClient = chatClient;
       _toolRegistery=registery;
        _logger = logger;
    }
    [HttpPost("{companyId:int}")]
    public async Task<IActionResult> Chat(
        [FromRoute] int companyId,
        [FromBody] ChatRequestDto request, 
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.message))
        {
            return BadRequest(new ChatResponseDto(
                Success: false,
                Reply: null,
                Error: "Message prompt cannot be empty."
            ));
        }

        _logger.LogInformation("Processing chat request for company {CompanyId} with prompt: {Prompt}", companyId, request.message);

        List<ChatMessage> conversation = new()
        {
            new ChatMessage(ChatRole.System, $"""
                You are the system's AI assistant integrated with personal MCP tools.
                ALWAYS check and call your available tools (like
                SoftDeleteCompanyProfileMcp, 
                GetAllRoomsMcp,
                CheckOutMcp, 
                GetAllVisitorsMcp, 
                GetVisitorMcp, 
                ClearNotificationMcp
                ) before answering questions.
                
                CRITICAL INSTRUCTION:
                The current active company ID is {companyId}.
                Whenever you call any tool that accepts a companyId parameter, you MUST pass {companyId} as the companyId argument.
                Never query data without scoping it to company ID {companyId}.
                Do not mention what tool you used or the company id in your renspose.
                """),
            new ChatMessage(ChatRole.User, request.message)
        };

        var chatOptions = new ChatOptions
        {
            Tools = _toolRegistery.Gettools()
        };

        ChatResponse response = await _chatClient.GetResponseAsync(
            conversation,
            chatOptions,
            cancellationToken
        );

        _logger.LogInformation("Chat completion successful.");

        return Ok(new ChatResponseDto(
            Success: true,
            Reply: response.Text,
            Error: null
        ));
    }
}