using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using simpli.Domain;


public class AppDbContext : IdentityDbContext<AppUser>
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
   :
   base(options)
  { }

  //tables
  public DbSet<Notification> Notifications { get; set; }
  public DbSet<Company> Companies { get; set; }
  public DbSet<Room> Rooms { get; set; }
  public DbSet<Visitor> Visitors { get; set; }


  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);


    //Applies the rules in ./confirgurations to db here
    builder.ApplyConfigurationsFromAssembly(
      typeof(AppDbContext)
      .Assembly);
  }
}