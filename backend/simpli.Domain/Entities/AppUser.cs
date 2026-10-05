
using Microsoft.AspNetCore.Identity;
using simpli.Domain;

public class AppUser : IdentityUser
{
  public int CompanyId { get; set; }
  public Company? Company { get; set; }
}