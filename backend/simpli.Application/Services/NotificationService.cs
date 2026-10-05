using simpli.Application.Dtos;
using simpli.Domain.Entities;

namespace simpli.Application.Services;

public class NotificationService
{
  private readonly NotificationMappers _mapper;
  private readonly INotificationRepo _notiRepo;

  public NotificationService(INotificationRepo notificationRepo, NotificationMappers mapper)
  {
    _mapper = mapper;
    _notiRepo = notificationRepo;
  }
  public async Task<List<NotificationDto>> GetAllNotifications(int companyId, QueryParameters query)
  {
    var notifications = await _notiRepo.GetAllNotifications(companyId, query);
    return notifications.Select(n => _mapper.MapToDto(n)).ToList();
  }

  public async Task MarkAllRead(int id)
  {
    await _notiRepo.MarkAllRead(id);
  }
  public async Task<NotificationDto> GetNotification(int id)
  {
    var noti = await _notiRepo.GetNotification(id);
    return _mapper.MapToDto(noti);
  }
  public async Task ClearAllNotifications(int companyId)
  {
    await _notiRepo.ClearAllNotifications(companyId);
  }
  public async Task<NotificationDto> CreateNotification(CreateNotificationDto notificationDto, int Id)
  {
    var entity = _mapper.MapToEntityFromCreate(notificationDto);
    var created = await _notiRepo.CreateNotification(entity, Id);
    if (created == null) throw new KeyNotFoundException("Could not create");
    return _mapper.MapToDto(created);
  }
}