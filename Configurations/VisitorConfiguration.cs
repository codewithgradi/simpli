using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain;
namespace simpli.Infrastructure.Configuration;

public class VisitorConfiguration : IEntityTypeConfiguration<Visitor>
{
  public void Configure(EntityTypeBuilder<Visitor> builder)
  {
    builder.HasKey(x => x.Id);

    //Many-To-Many relationship: This creates a join table
    builder.HasMany(x => x.Companies)
    .WithMany(x => x.Visitors)
    .UsingEntity(j => j.ToTable("CompanyVisitors"));
  }

}