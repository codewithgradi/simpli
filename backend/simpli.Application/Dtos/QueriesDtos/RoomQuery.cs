public class RoomQuery
{
  public int RoomId { get; set; }
}
public class GetRoomQuery
{
  public string? roomno { get; set; }
}

public class NotificationQuery
{
  public int PageNumber { get; set; }
  public int PageSize { get; set; }
}