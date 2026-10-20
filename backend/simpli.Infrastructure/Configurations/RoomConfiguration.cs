using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain;
namespace simpli.Infrastructure.Configuration;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
  public void Configure(EntityTypeBuilder<Room> builder)
  {
    builder.HasKey(x => x.Id);

    builder.Property(x => x.Status)
    .HasColumnName("Status").HasConversion<string>().IsRequired();
  }
}