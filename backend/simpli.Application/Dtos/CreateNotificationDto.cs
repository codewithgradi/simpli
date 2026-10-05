using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace simpli.Application.Dtos
{
  public class CreateNotificationDto
  {
    [Required]
    public string VisitorName { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [Required]
    public VisitorStatus Status { get; set; }
  }
}