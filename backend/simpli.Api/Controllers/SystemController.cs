using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using simpli.Application;
using simpli.Application.Services;

namespace simpli.Api.Controllers;

[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
[ApiController]
[Authorize]

public class SystemController:ControllerBase
{
    private readonly SystemEmailService _service;

    public SystemController(SystemEmailService service)
    {
        _service=service;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GeneralQuery query)
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (companyId == null) return Unauthorized("Invalid Session.");
        var emails = await _service.GetAll(query,companyId);
        if(emails == null) return BadRequest("emails not found");
        return Ok(emails);
    }
    [HttpGet("visitor")]
    public async Task<IActionResult> GetOne([FromQuery] string VisitorFullName)
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (companyId == null) return Unauthorized("Invalid Session.");
        var user = await _service.Get(VisitorFullName,companyId);
        if(user == null) return BadRequest("User not found");
        return Ok(user);
    }
}