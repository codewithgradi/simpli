public class GetVisitorsQueryParameters : QueryParameters
{
  public string Name { get; set; } = string.Empty;
  public VisitorStatus? CheckedIn { get; set; }
  public Gender? Gender { get; set; }
  public string SearchItem { get; set; } = string.Empty;
}