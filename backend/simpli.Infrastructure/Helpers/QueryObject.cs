namespace simpli.Infrastructure.Helpers;

public class QueryObject
{
  public string? VisitorName { get; set; }
  public string? SortBy { get; set; }
  public bool IsDescending { get; set; } = false;

  private int _pageNumber = 1;
  public int PageNumber
  {
    get => _pageNumber;
    set => _pageNumber = value < 1 ? 1 : value;
  }

  private int _pageSize;
  public int PageSize
  {
    get => _pageSize;
    set => _pageSize = value > 50 ? 50 : (value < 1 ? 1 : value);
  }
}