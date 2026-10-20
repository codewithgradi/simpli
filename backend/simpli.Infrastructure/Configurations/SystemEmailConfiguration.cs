using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using simpli.Domain.Entities;
namespace simpli.Infrastructure;
public class SytemEmailsConfiguration : IEntityTypeConfiguration<SystemEmails>
{
    public void Configure(EntityTypeBuilder<SystemEmails> builder)
    {
        builder.HasKey(x => x.Id);
    }
}