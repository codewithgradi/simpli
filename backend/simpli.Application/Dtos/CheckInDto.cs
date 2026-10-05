using System.ComponentModel.DataAnnotations;

namespace simpli.Domain.Entities;

public class CheckInDto
{
  [Required(ErrorMessage = "First name is required")]
  public string FirstName { get; set; }
  [Required(ErrorMessage = "Last name is required")]
  public string LastName { get; set; }
  [Required(ErrorMessage = "Id Number is required")]
  [MinLength(13, ErrorMessage = "ID number should be 13 digits")]
  [MaxLength(13, ErrorMessage = "ID number should be 13 digits")]
  public string IdNumber { get; set; }
  [Required(ErrorMessage = "Phone number is required")]
  [MinLength(10, ErrorMessage = "Phone number should be 10 digits")]
  [MaxLength(10, ErrorMessage = "Phone number should be 10 digits")]
  [Phone(ErrorMessage = "Invalid phone format")]
  public string PhoneNumber { get; set; }
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid email address")]
  public string Email { get; set; }
  [Required(ErrorMessage = "Room number is required")]
  public string RoomNumber { get; set; }
  [Required(ErrorMessage = "Reason for visit is required")]
  public ReasonForVisit ReasonForVisit { get; set; }
  [Required(ErrorMessage = "Gender is required")]
  public Gender Gender { get; set; }
}