namespace simpli.Domain;

public class Notification
{
  public int Id { get; set; }
  public string? VisitorName { get; set; }
  public bool IsRead { get; set; } = false;
  public VisitorStatus Status { get; set; }
  public DateTime CreatedAt { get; set; }

  public Company? Company { get; set; }
  public int CompanyId { get; set; }
}