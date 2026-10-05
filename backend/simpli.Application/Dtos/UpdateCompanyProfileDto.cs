using System.ComponentModel.DataAnnotations;
using simpli.Domain;

public class UpdateCompanyProfileDto
{
  [Required(ErrorMessage = "Company name is required")]
  public string CompanyName { get; set; }
  [Required(ErrorMessage = "Company registration number is required")]

  public string RegistrationNumber { get; set; }
  [Required(ErrorMessage = "Company contact number is required")]
  [Phone(ErrorMessage = "Invalid phone number")]
  [MaxLength(10, ErrorMessage = "Number needs to be 10 digit long.")]
  [MinLength(10, ErrorMessage = "Number needs to be 10 digit long.")]
  public string ContactNumber { get; set; }
  [Required(ErrorMessage = "Address is required")]
  public AddressContent Address { get; set; }
  [Required(ErrorMessage = "Website is required")]
  public string Website { get; set; }


}