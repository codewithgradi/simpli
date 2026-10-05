using System.ComponentModel.DataAnnotations;

namespace simpli.Domain.Entities;


public class UpdateRoomDto
{
  [Required(ErrorMessage = "Room number is required")]
  public string? RoomNumber { get; set; }
  [Required(ErrorMessage = "Room floor is required")]
  public int Floor { get; set; }
  [Required(ErrorMessage = "Room type is required")]
  public RoomType Type { get; set; }
  [Required(ErrorMessage = "Room status is required")]
  public RoomStatus Status { get; set; }
}