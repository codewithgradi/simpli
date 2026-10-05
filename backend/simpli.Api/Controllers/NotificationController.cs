using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using simpli.Application.Dtos;
using simpli.Application.Services;

namespace simpli.Api
{
  [Route("api/[controller]")]
  [ApiController]
  [ApiVersion("1.0")]

  public class NotificationController : ControllerBase
  {
    private readonly NotificationService _notiService;
    public NotificationController(NotificationService service)
    {
      _notiService = service;

    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllNotification([FromQuery] QueryParameters query)
    {
      var companyId = Convert.ToInt32(User.FindFirst("CompanyID").Value);
      if (companyId == null) return Unauthorized("Invalid session");
      var notifcations = await _notiService.GetAllNotifications(companyId, query);
      if (notifcations == null) return null;
      return Ok(notifcations);
    }
    [Authorize]
    [HttpPatch("mark-read")]
    public async Task<IActionResult> MarkAllRead()
    {
      var companyId = Convert.ToInt32(User.FindFirst("CompanyID").Value);
      if (companyId == null) return Unauthorized("Invalid session.");
      await _notiService.MarkAllRead(companyId);
      return NoContent();
    }
    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> clearAll()
    {
      var companyID = Convert.ToInt32(User.FindFirst("CompanyID").Value);
      if (companyID == null) return Unauthorized();
      await _notiService.ClearAllNotifications(companyID);
      return NoContent();
    }

    [Authorize]
    [HttpGet("{id:int}", Name = "GetOne")]
    public async Task<IActionResult> GetOne([FromRoute] int id)
    {
      var notifcation = await _notiService.GetNotification(id);
      if (notifcation == null) return BadRequest("Could not get notification");
      return Ok(notifcation);
    }
  }
}