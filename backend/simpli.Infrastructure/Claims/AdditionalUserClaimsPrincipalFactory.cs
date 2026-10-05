using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;


public class AdditionalUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser>
{
  private readonly AppDbContext _context;
  public AdditionalUserClaimsPrincipalFactory
  (
    UserManager<AppUser> userManager,
    IOptions<IdentityOptions> options,
    AppDbContext context
  ) :
  base(userManager, options)
  { _context = context; }
  protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppUser appUser)
  {
    var identity = await base.GenerateClaimsAsync(appUser);

    var databaseCompanyId =
    await _context.Companies
    .Where(x => x.AppUserId == appUser.Id)
    .Select(c => c.Id)
    .FirstOrDefaultAsync();

    identity.AddClaim(new Claim("CompanyId", databaseCompanyId.ToString()));
    if (!string.IsNullOrEmpty(appUser.Email))
    {
      identity.AddClaim(new Claim("Email", appUser.Email));
    }
    return identity;
  }
}