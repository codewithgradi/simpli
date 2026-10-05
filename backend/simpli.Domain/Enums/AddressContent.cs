

using System.ComponentModel.DataAnnotations;

namespace simpli.Domain;

public class AddressContent
{
  [Required(ErrorMessage = "Street number is required")]
  public string? StreetNumber { get; set; }
  [Required(ErrorMessage = "Street Name is required")]
  public string? StreetName { get; set; }
  [Required(ErrorMessage = "City  is required")]
  public string? City { get; set; }
  [Required(ErrorMessage = "Country is required")]
  public string? Country { get; set; }

}