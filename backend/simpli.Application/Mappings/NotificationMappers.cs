using Riok.Mapperly.Abstractions;
using simpli.Application.Dtos;
using simpli.Domain;
using simpli.Domain.Entities;

[Mapper]
public partial class NotificationMappers
{
  public partial Notification MapToEntityFromCreate(CreateNotificationDto dto);
  public partial NotificationDto MapToDto(Notification notification);
  public partial Notification MapToEntity(NotificationDto notification);
  public partial IQueryable<NotificationMessageDto> ProjectToDto(IQueryable<Notification> query);

}