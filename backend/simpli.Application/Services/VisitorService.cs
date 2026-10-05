using Microsoft.Extensions.Logging;
using simpli.Application.Dtos;
using simpli.Domain;
using simpli.Domain.Entities;

namespace simpli.Application.Services;

public class VisitorService
{
  private readonly IVisitorRepo _visitorRepo;
  private readonly VisitorMappers _mapper;
  private readonly IEmailService _emailService;
  private readonly ILogger<VisitorService> _logger;

  public VisitorService(IVisitorRepo visitorRepo, VisitorMappers mapper, IEmailService service, ILogger<VisitorService>? logger)
  {
    _visitorRepo = visitorRepo;
    _mapper = mapper;
    _emailService = service;
    _logger = logger;
  }
  public async Task<VisitorDto> CheckIn(CheckInDto visitorDto, int companyID, int roomId)
  {
    var visitor = _mapper.MapToEntityFromCheckIn(visitorDto);
    VisitorAndQrCodeDataDto dataResult = await _visitorRepo.CheckIn(visitor, companyID, roomId);


    try
    {
      await _emailService.SendVisitorEmailAsync(
              visitor.Email!,
              visitor.FirstName!,
              visitorDto.RoomNumber!,
              dataResult.QrCodeData);
    }
    catch (Exception e)
    {
      _logger.LogError(e, "Failed to send check-in email to {Email}", visitor.Email);
    }
    ;

    return _mapper.MapToDto(dataResult.Visitor);
  }
  public async Task CheckOut(CheckOutDto dto)
  {
    if (dto == null)
    {
      Console.WriteLine("Passcode androom Id missing");
      return;
    }
    var entity = _mapper.MapToEntityFromCheckOut(dto);
    await _visitorRepo.CheckOut(entity);
  }
  public async Task<VisitorDto> GetVisitor(int id)
  {
    var entity = await _visitorRepo.GetVisitor(id);
    return _mapper.MapToDto(entity);
  }
  public async Task<List<VisitorDto>> GetAllVisitors(GetVisitorsQueryParameters query, int companyID)
  {
    var visitors = await _visitorRepo.GetAllVisitors(query, companyID);
    return visitors.Select(v => _mapper.MapToDto(v)).ToList();
  }
}