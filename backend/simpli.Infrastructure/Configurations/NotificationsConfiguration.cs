using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain;
namespace simpli.Infrastructure.Configuration;

public class NotificationsConfiguration : IEntityTypeConfiguration<Notification>
{
  public void Configure(EntityTypeBuilder<Notification> builder)
  {
    builder.HasKey(x => x.Id);
  }
}