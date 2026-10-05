using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain;
namespace simpli.Infrastructure.Configuration;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
  public void Configure(EntityTypeBuilder<Company> builder)
  {
    //Primary Key
    builder.HasKey(c => c.Id);
    //
    builder.OwnsOne(c => c.Address);
    //One company have many notifications
    builder
    .HasMany(c => c.Notifications)
    .WithOne(c => c.Company)
    .HasForeignKey(x => x.CompanyId)
    .OnDelete(DeleteBehavior.Restrict);

    //One company have many rooms
    builder.HasMany(x => x.Rooms)
    .WithOne(x => x.Company)
    .HasForeignKey(x => x.CompanyId)
    .OnDelete(DeleteBehavior.Restrict);
  }
}