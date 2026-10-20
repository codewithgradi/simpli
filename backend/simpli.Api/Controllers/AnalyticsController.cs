using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using simpli.Application.Services;

namespace simpli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        IAnalyticsService analyticsService,
        ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAnalytics(
        CancellationToken cancellationToken)
    {
        var comapnyIdClaim = User.FindFirstValue("CompanyId");
        if (comapnyIdClaim == "0" || string.IsNullOrEmpty(comapnyIdClaim))
        {
            Console.WriteLine($"CompanyId : {comapnyIdClaim}");
            return Unauthorized("Invalid session");
        }
        var companyId = Convert.ToInt32(comapnyIdClaim);
        try
        {
            _logger.LogInformation("Fetching dashboard analytics for company {CompanyId}", companyId);

            var analytics = await _analyticsService.GetDashboardAnalyticsAsync(companyId, cancellationToken);

            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching analytics for company {CompanyId}", companyId);
            return StatusCode(500, new { message = "An error occurred while generating dashboard analytics." });
        }
    }
}