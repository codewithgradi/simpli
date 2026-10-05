namespace simpli.Application.Dtos;

public class GetSystemEmailDto
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string VisitorFullName { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public string? PassCode { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}