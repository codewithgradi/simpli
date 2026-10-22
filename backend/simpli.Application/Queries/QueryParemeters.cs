public class QueryParameters
{
  private int _Page = 1;
  private int _size = 10;
  const int _maxSize = 20;

  public int Page
  {
    get => _Page;
    set => _Page = value <= 0 ? 1 : value; 
  }

  public int Size
  {
    get => _size;
    set => _size = value <= 0 ? 10 : Math.Min(value, _maxSize);
  }

  public string SortOrder { get; set; } = "asc";
  public string SortBy { get; set; } = string.Empty;
  public string CmpId { get; set; } = string.Empty;
  public bool IsAvailable { get; set; } 
}