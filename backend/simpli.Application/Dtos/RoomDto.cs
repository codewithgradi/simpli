namespace simpli.Domain.Dtos;

public class RoomDto
{
  public int Id { get; set; }
  public string? RoomNumber { get; set; }
  public int Floor { get; set; }
  public RoomType Type { get; set; }
  public RoomStatus Status { get; set; }
  public int NumberOfTimesBooked { get; set; } = 0;
  public int CompanyId { get; set; }

}