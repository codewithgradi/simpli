public class NotificationMessageDto
{
  public int Name { get; set; }
  public DateTime CreatedAt { get; set; }
  public string? Message { get; set; } = "Successfully completed check-in at the front desk.";
}