using System.ComponentModel.DataAnnotations;

namespace simpli.Domain.Entities;

public class CheckInDto
{
  private string _idNumber = "0000000000000";
  private string _phoneNumber = "0000000000";
  private string _email = "simpli.solutions.sys@gmail.com";

  [Required(ErrorMessage = "First name is required")]
  public string FirstName { get; set; }

  [Required(ErrorMessage = "Last name is required")]
  public string LastName { get; set; }

  [Required(ErrorMessage = "Id Number is required")]
  [MinLength(13, ErrorMessage = "ID number should be 13 digits")]
  [MaxLength(13, ErrorMessage = "ID number should be 13 digits")]
  public string IdNumber
  {
    get => _idNumber;
    set => _idNumber = string.IsNullOrWhiteSpace(value) ? "0000000000000" : value;
  }

  [Required(ErrorMessage = "Phone number is required")]
  [MinLength(10, ErrorMessage = "Phone number should be 10 digits")]
  [MaxLength(10, ErrorMessage = "Phone number should be 10 digits")]
  [Phone(ErrorMessage = "Invalid phone format")]
  public string PhoneNumber
  {
    get => _phoneNumber;
    set => _phoneNumber = string.IsNullOrWhiteSpace(value) ? "0000000000" : value;
  }

  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid email address")]
  public string Email
  {
    get => _email;
    set => _email = string.IsNullOrWhiteSpace(value) ? "default@example.com" : value;
  }

  [Required(ErrorMessage = "Room number is required")]
  public string RoomNumber { get; set; }

  [Required(ErrorMessage = "Reason for visit is required")]
  public ReasonForVisit ReasonForVisit { get; set; }

  [Required(ErrorMessage = "Gender is required")]
  public Gender Gender { get; set; }
}