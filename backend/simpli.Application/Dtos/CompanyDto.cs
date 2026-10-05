namespace simpli.Domain.Entities;

public class CompanyDto
{
  public int Id { get; set; }
  public string? CompanyName { get; set; }
  public string? RegistrationNumber { get; set; }
  public string? ContactNumber { get; set; }
  public bool isProfileComplete { get; set; }
  public bool isDeleted { get; set; }
  public string? Website { get; set; }
  public AddressContent? Address { get; set; }
  public DateTime CreatedAt { get; set; }

}