namespace simpli.Domain;

public class Visitor
{
  public int Id { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? IdNumber { get; set; }
  public string? PhoneNumber { get; set; }
  public string? Email { get; set; }
  public ReasonForVisit ReasonForVisit { get; set; }
  public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
  public DateTime CheckOutTime { get; set; }
  public VisitorStatus Status { get; set; } = VisitorStatus.CheckedIn;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public Gender Gender { get; set; }
  public string? PassCode { get; set; }

  public Room? Room { get; set; }
  public List<Company>? Companies { get; set; }
  public int CompanyId { get; set; }
  public int RoomId { get; set; }
}