using simpli.Application;
using simpli.Domain;
using simpli.Domain.Entities;

public interface IRoomRepo
{
    Task<Room> CreateRoom(Room room, int companyId);
    Task<Room> UpdateRoom(Room room, int roomId, int companyId);
    Task<List<Room>> GetAllRooms(int companyId, QueryParameters query);
    Task<Room> GetRoom(int companyId, string roomNo);
    Task<bool> RoomExists(int companyId, int roomId);
    Task<int?> GetRoomIdByRoomNumber(int companyId, string roomNum);
    Task<string> UpdateRoomTocheckIn(int roomId);

}