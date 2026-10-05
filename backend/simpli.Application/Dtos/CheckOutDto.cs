using System.ComponentModel.DataAnnotations;

public class CheckOutDto
{
    [Required(ErrorMessage = "Room id is required")]
    public int RoomId { get; set; }
    [Required(ErrorMessage = "Passcode is required")]
    public string? PassCode { get; set; }
}