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
        var queryable = _context.Rooms
            .Where(r => r.CompanyId == companyId);

        if (query?.IsAvailable == true)
        {
            queryable = queryable.Where(x => x.Status == RoomStatus.Available);
        }

        if (!string.IsNullOrEmpty(query.SortBy))
        {
            if (query.SortBy.Equals("roomNumber", StringComparison.OrdinalIgnoreCase))
            {
                queryable = (query.SortOrder?.ToLower() == "desc")
                    ? queryable.OrderByDescending(r => r.RoomNumber)
                    : queryable.OrderBy(r => r.RoomNumber);
            }
            else
            {
                queryable = queryable.OrderBy(r => r.Id);
            }
        }
        else
        {
            queryable = queryable.OrderBy(r => r.Id);
        }

        // 3. Apply pagination
        int skip = (query.Page - 1) * query.Size;
        queryable = queryable.Skip(skip).Take(query.Size);

        return await queryable.ToListAsync();
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

    public async Task<List<Room>> GetAllRoomsStats(int companyId)
    {
       return await _context.Rooms.Where(c=>c.CompanyId==companyId).ToListAsync();
    }
}