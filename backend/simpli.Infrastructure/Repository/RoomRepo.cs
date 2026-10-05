using Microsoft.EntityFrameworkCore;
using simpli.Domain;
using simpli.Domain.Exceptions;


public class RoomRepo : IRoomRepo
{
    private readonly AppDbContext _context;
    public RoomRepo(AppDbContext context)
    {
        _context = context;

    }
    public async Task<Room> CreateRoom(Room room, int companyId)
    {

        room.CompanyId = companyId;
        room.Status = RoomStatus.Available;
        await _context.Rooms.AddAsync(room);
        await _context.SaveChangesAsync();
        return room;
    }

    public async Task<List<Room>> GetAllRooms(int companyId, QueryParameters query)
    {
        IQueryable<Room> roomsQuery = _context.Rooms.Where(x => x.CompanyId == companyId);

        return await roomsQuery
        .Skip(query.Size * (query.Page - 1))
        .Take(query.Size)
        .ToListAsync();

    }
    public async Task<int?> GetRoomIdByRoomNumber(int companyId, string roomNo)
    {
        var room = await _context.Rooms
        .FirstOrDefaultAsync(
            x => x.CompanyId == companyId
        && x.RoomNumber == roomNo
        );
        if (room == null) return null;
        return room.Id;
    }

    public async Task<Room> GetRoom(int companyId, string roomNo)
    {
        var room = await _context.Rooms
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.RoomNumber == roomNo && x.CompanyId == companyId);

        if (room == null) return null;
        return room;

    }

    public async Task<bool> RoomExists(int companyId, int roomId)
    {
        return await _context.Rooms.AnyAsync(x => x.Id == roomId && x.CompanyId == companyId);
    }

    public async Task<Room> UpdateRoom(Room updatedRoom, int roomId, int companyId)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == roomId && companyId == x.CompanyId);
        if (room == null) return null;

        room.Floor = updatedRoom.Floor;
        room.RoomNumber = updatedRoom.RoomNumber;
        room.Type = updatedRoom.Type;
        room.Status = updatedRoom.Status;

        await _context.SaveChangesAsync();
        return room;
    }

    public async Task<string> UpdateRoomTocheckIn(int roomId)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);
        if (room == null)
        {
            throw new ResourceNotFoundException("Room was not found");
        }
        if (room.Status != RoomStatus.Available)
        {
            throw new BusinessRuleException("Room is already booked");
        }
        room.Status = RoomStatus.Occupied;
        room.NumberOfTimesBooked++;

        await _context.SaveChangesAsync();

        return room.RoomNumber!;
    }
}