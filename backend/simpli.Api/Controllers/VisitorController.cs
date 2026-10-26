
using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using simpli.Application.Dtos;
using simpli.Application.Services;
using simpli.Domain.Entities;
using simpli.Domain.Exceptions;

namespace simpli.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [ApiVersion("1.0")]

  public class VisitorController : ControllerBase
  {
    private readonly VisitorService _visitorService;
    private readonly NotificationService _notifService;
    public VisitorController(VisitorService service, NotificationService notificationService)
    {
      _visitorService = service;
      _notifService = notificationService;
    }

    [HttpPost("check-in")]
    public async Task<IActionResult> CheckIn(
      [FromBody] CheckInDto inDto,
      [FromQuery] RoomQuery query)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var companyIdString = inDto.CompanyId;
      if (int.TryParse(companyIdString, out int companyId))
      {
        var visitor = await
       _visitorService
       .CheckIn(inDto, companyId, query.RoomId);
        var notisf = await _notifService
        .CreateNotification
        (
          new CreateNotificationDto
          {
            Status = visitor.Status,
            VisitorName = visitor.FirstName
          }, companyId);
        if (notisf == null) return BadRequest("Could not create Notification");
        return CreatedAtRoute(
          nameof(GetVisitor),
          new { Id = visitor.Id },
          visitor
        );
      }
      else
      {
        return BadRequest("Could not check in");
      }
    }
    [HttpPatch("check-out")]
    public async Task<IActionResult> CheckOut([FromBody] CheckOutDto outDto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);
      try
      {
        await _visitorService.CheckOut(outDto);
        return Ok("Checked out successfully");
      }
      catch (InvalidOperationException e)
      {
        return BadRequest(new { message = e.Message });
      }
      catch (ResourceNotFoundException e) { return BadRequest(new { message = e.Message }); }
    }
    [Authorize]
    [HttpGet("{id:int}", Name = "GetVisitor")]
    public async Task<IActionResult> GetVisitor([FromRoute] int id)
    {
      var visitor = await _visitorService.GetVisitor(id);
      if (visitor == null) return NotFound("Visitor not found.");
      return Ok(visitor);
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GettAllVisitors([FromQuery] GetVisitorsQueryParameters query)
    {
      var companyIdStr = User.FindFirstValue("CompanyId");
      if (string.IsNullOrEmpty(companyIdStr) || !int.TryParse(companyIdStr, out int companyId))
      {
        return Unauthorized("Invalid session.");
      }
      var visitors = await _visitorService.GetAllVisitors(query, companyId);
      if (visitors == null) return NotFound("Visitor not found");
      return Ok(visitors);
    }

  }

}