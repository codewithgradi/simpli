namespace simpli.Domain;

public class Room
{
  public int Id { get; set; }
  public string? RoomNumber { get; set; }
  public int Floor { get; set; }
  public RoomType Type { get; set; } = RoomType.Standard;
  public RoomStatus Status = RoomStatus.Available;
  public int NumberOfTimesBooked { get; set; } = 0;

  public Company? Company { get; set; }
  public int CompanyId { get; set; }

}