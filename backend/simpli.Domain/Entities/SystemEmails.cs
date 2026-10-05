namespace simpli.Domain.Entities;
public class SystemEmails
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string VisitorFullName { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public int PassCode { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public Company? Company { get; set; }
}