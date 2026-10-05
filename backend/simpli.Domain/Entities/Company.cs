namespace simpli.Domain;

public class Company
{
  public int Id { get; set; }
  public string? CompanyName { get; set; }
  public string? RegistrationNumber { get; set; }
  public string? ContactNumber { get; set; }
  public bool isProfileComplete { get; set; }
  public bool isDeleted { get; set; }
  public List<Notification>? Notifications { get; set; }
  public AddressContent? Address { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public string? Website { get; set; }
  public string? AppUserId { get; set; }

  public List<Room>? Rooms { get; set; }
  public List<Visitor>? Visitors { get; set; }
  public AppUser? User { get; set; }

}

