using System.Security.Principal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain;

public class UserConfigurations : IEntityTypeConfiguration<AppUser>
{
  public void Configure(EntityTypeBuilder<AppUser> builder)
  {

    builder.HasOne(x => x.Company)
    .WithOne(x => x.User)
    .HasForeignKey<Company>(u => u.AppUserId)
    .OnDelete(DeleteBehavior.Restrict);
  }
}