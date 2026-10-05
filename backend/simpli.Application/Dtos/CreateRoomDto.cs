using System.ComponentModel.DataAnnotations;

namespace simpli.Application;

public class CreateRoomDto
{
  [Required(ErrorMessage = "Floor is required")]
  public int Floor { get; set; }
  [Required(ErrorMessage = "Room number is required")]
  public string RoomNumber { get; set; }
}