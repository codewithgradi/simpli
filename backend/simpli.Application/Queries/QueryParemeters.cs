public class QueryParameters
{
  private int _Page = 1;
  private int _size = 10;
  const int _maxSize = 20;
  public int Page
  {
    get
    {
      return _Page;
    }
    set
    {
      _Page = _Page <= 0 ? 1 : value;
    }
  }
  public int Size
  {
    get
    {
      return _size;
    }
    set
    {
      _size = value <= 0 ? 10 : Math.Min(value, _maxSize);
    }
  }
  public string SortOrder { get; set; } = "asc";
  public string SortBy { get; set; } = string.Empty;
}