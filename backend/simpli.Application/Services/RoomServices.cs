using simpli.Application.Dtos;
using simpli.Domain.Dtos;
using simpli.Domain.Entities;
using simpli.Domain.Exceptions;
namespace simpli.Application.Services;

public class RoomServices
{
  private readonly IRoomRepo _roomRepo;
  private readonly RoomMappers _mapper;

  public RoomServices(IRoomRepo roomRepo, RoomMappers mapper)
  {
    _roomRepo = roomRepo;
    _mapper = mapper;
  }
  public async Task<RoomDto> CreateRoom(CreateRoomDto roomDto, int companyID)
  {
    var room = _mapper.MapFromCreate(roomDto);
    var existingRoomByRoomNumber = await _roomRepo.GetRoomIdByRoomNumber(companyID, roomDto.RoomNumber!);
    if (existingRoomByRoomNumber != null)
    {
      throw new BusinessRuleException($"Duplicate room number : room with room number {roomDto.RoomNumber} exists.");
    }
    var created = await _roomRepo.CreateRoom(room, companyID);
    return _mapper.MapToDto(created);
  }
  public async Task<RoomDto> UpdateRoom(UpdateRoomDto updateRoom, int roomId, int companyID)
  {
    var roomDto = _mapper.MapToRoomDtoFromUpdate(updateRoom);
    var entity = _mapper.MapToEntity(roomDto);
    var room = await _roomRepo.UpdateRoom(entity, roomId, companyID);
    return _mapper.MapToDto(room);
  }
  public async Task<List<RoomDto>> GetAllRooms(int companyID, QueryParameters query)
  {
    var rooms = await _roomRepo.GetAllRooms(companyID, query);
    var roomsDto = rooms
    .Select(r => _mapper.MapToDto(r))
    .ToList();
    return roomsDto;
  }
  public async Task<RoomDto> GetRoom(int companyID, string roomNo)
  {
    var room = await _roomRepo.GetRoom(companyID, roomNo);
    if (room == null) throw new KeyNotFoundException("Room not found");
    return _mapper.MapToDto(room);
  }

}