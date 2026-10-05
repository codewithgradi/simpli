using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using simpli.Application;
using simpli.Application.Services;
using simpli.Domain.Entities;

//accesssed by companies
namespace simpli.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [ApiVersion("1.0")]

  public class RoomController : ControllerBase
  {
    private readonly RoomServices _roomService;
    public RoomController(RoomServices services)
    {
      _roomService = services;
    }
    [Authorize]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllRooms([FromQuery] QueryParameters query)
    {
      var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
      if (companyId == null) return Unauthorized("Invalid Session.");
      var rooms = await _roomService.GetAllRooms(companyId, query);
      if (rooms == null) return BadRequest("Error");
      return Ok(rooms);

    }

    [Authorize]
    [HttpGet(Name = "GetRoom")]
    public async Task<IActionResult> GetRoom([FromQuery] GetRoomQuery query)
    {
      var companyId = Convert.ToInt32(User.FindFirst("CompanyId").Value);
      if (companyId == null) return Unauthorized("No company in session.");
      var room = await _roomService.GetRoom(companyId, query.roomno!);
      if (room == null) return Unauthorized("Missing company id or room number.");
      return Ok(room);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateRoom(
      [FromBody] CreateRoomDto roomDto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);
      var companyIdClaimString = User.FindFirstValue("CompanyID");
      if (string.IsNullOrEmpty(companyIdClaimString) || !int.TryParse(companyIdClaimString, out int companyId))
      {
        return Unauthorized("No company in session");
      }
      var room = await _roomService.CreateRoom(roomDto, companyId);
      if (room == null) return BadRequest("Could not create room");
      return CreatedAtRoute(nameof(GetRoom), new { Id = room.Id }, room);



    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateRoom(
      [FromBody] UpdateRoomDto updateRoom,
      [FromQuery] UpdateRoomQuery query
    )
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);

      var companyIdStr = User.FindFirstValue("CompanyId");
      if (string.IsNullOrEmpty(companyIdStr) || !int.TryParse(companyIdStr, out int companyId))
      {
        return Unauthorized("Invalid session.");
      }

      var room = await _roomService.UpdateRoom(updateRoom, query.Ri, companyId);
      if (room == null) return BadRequest("Could not Update room");
      return NoContent();



    }

  }
}