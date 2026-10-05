namespace simpli.Application.Dtos;

using Riok.Mapperly.Abstractions;
using simpli.Domain;
using simpli.Domain.Dtos;
using simpli.Domain.Entities;

[Mapper]
public partial class RoomMappers
{
  public partial RoomDto MapToDto(Room room);
  public partial Room MapToEntity(RoomDto dto);
  public partial Room MapFromCreate(CreateRoomDto dto);
  public partial RoomDto MapToRoomDtoFromUpdate(UpdateRoomDto dto);
  public partial IQueryable<RoomDto> ProjectToRoomDto(IQueryable<Room> rooms);
}
