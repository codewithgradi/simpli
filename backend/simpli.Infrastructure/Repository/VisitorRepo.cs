using Microsoft.EntityFrameworkCore;
using simpli.Domain;
using simpli.Domain.Exceptions;

public class VisitorRepo : IVisitorRepo
{
    private readonly AppDbContext _context;
    private readonly INotificationRepo _notiRepo;
    private readonly IRoomRepo _roomRepo;

    public VisitorRepo(AppDbContext context, INotificationRepo notirepo, IRoomRepo roomRepo)
    {
        _context = context;
        _notiRepo = notirepo;
        _roomRepo = roomRepo;
    }
    public async Task<VisitorAndQrCodeDataDto> CheckIn(Visitor visitor, int companyId, int roomId)
    {
        visitor.CompanyId = companyId;
        visitor.RoomId = roomId;

        string qrCodeData = Utils.GeneratePasscode(roomId);
        string passcode = Utils.GetPassCodeUtility(qrCodeData);
        visitor.PassCode = passcode;

        //Updating room
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);
        if (room == null)
        {
            throw new ResourceNotFoundException("Room was not found");
        }
        if (room.Status != RoomStatus.Available)
        {
            throw new BusinessRuleException("Room is already booked");
        }
        var roomIdExtracted = await _roomRepo.GetRoomIdByRoomNumber(companyId, room.RoomNumber);
        if (roomIdExtracted != roomId)
        {
            throw new ResourceConflictException("Room number does not match the room Id.");
        }
        ;


        room.Status = RoomStatus.Occupied;
        room.NumberOfTimesBooked++;

        _context.Visitors.Add(visitor);

        await _context.SaveChangesAsync();

        return new VisitorAndQrCodeDataDto
        {
            Visitor = visitor,
            QrCodeData = qrCodeData
        };
    }

    public async Task CheckOut(Visitor checkout)
    {
        if (checkout == null) { throw new ResourceNotFoundException("Missing checkout body"); }
        ;

        var visitor = await _context.Visitors.FirstOrDefaultAsync(
            x => x.PassCode == checkout.PassCode
            && x.PassCode != null);

        if (visitor == null)
        {
            throw new ResourceNotFoundException("No visitor was found");
        }

        var room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == checkout.RoomId);
        if (room == null)
        {
            throw new ResourceNotFoundException(
                $"Room with{checkout.RoomId} was not found ");
        }
        ;


        visitor.Status = VisitorStatus.CheckedOut;
        visitor.CheckOutTime = DateTime.UtcNow;
        room.Status = RoomStatus.Available;

        var notifcation = await _notiRepo
        .CreateNotification(
            new Notification
            {
                CompanyId = visitor.CompanyId,
                VisitorName = visitor.FirstName,
                Status = VisitorStatus.CheckedOut
            },
            visitor.CompanyId);

        await _context.SaveChangesAsync();
    }

    public async Task<List<Visitor>> GetAllVisitors(GetVisitorsQueryParameters query, int companyID)
    {
        IQueryable<Visitor> visitors = _context.Visitors
        .Where(x => x.CompanyId == companyID);

        if (!string.IsNullOrEmpty(query.SearchItem))
        {
            visitors = visitors.Where(
              v => v.FirstName.ToString()
            .Contains(query.SearchItem.ToString()));
        }
        if (!string.IsNullOrEmpty(query.Name))
        {
            string searchItem = query.Name.ToString();
            visitors = visitors.Where(v =>
            v.FirstName.ToString().Contains(searchItem)
            || v.LastName.ToString().Contains(searchItem));
        }
        if (query.Gender != null)
        {
            visitors = visitors.Where(v => v.Gender == query.Gender);
        }
        if (query.CheckedIn != null)
        {
            visitors = visitors.Where(v => v.Status == query.CheckedIn);
        }

        if (!string.IsNullOrEmpty(query.SortBy))
        {
            bool isDescending = query.SortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);
            visitors = query.SortBy.ToLower() switch
            {
                "firstname" => isDescending ?
                 visitors.OrderByDescending(v => v.FirstName)
                 : visitors.OrderBy(v => v.FirstName),

                "lastname" => isDescending ?
                visitors.OrderByDescending(v => v.LastName)
                : visitors.OrderBy(v => v.LastName),

                "idnumber" => isDescending ?
                visitors.OrderByDescending(v => v.IdNumber)
                : visitors.OrderBy(v => v.IdNumber),

                _ => visitors.OrderBy(v => v.Id)
            };
        }
        else
        {
            visitors = visitors.OrderBy(v => v.Id);
        }


        return await visitors
        .Skip(query.Size * (query.Page - 1))
        .Take(query.Size)
        .ToListAsync();
    }

    public async Task<Visitor> GetVisitor(int id)
    {
        var visitor = await _context.Visitors.FirstOrDefaultAsync(x => x.Id == id);
        if (visitor == null) return null;
        return visitor;
    }
}