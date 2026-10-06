using System.ComponentModel.DataAnnotations;

namespace simpli.Application.Dtos.Auth;

public class RegisterDto
{
    [Required(ErrorMessage ="Please provide email")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please provide password")]
    [MinLength(8, ErrorMessage ="Password should be at least 8 characters long")]
    public string Password { get; set; }= string.Empty;
    
    [Required(ErrorMessage = "Please provide company registration")]
    public string? RegistrationNumber { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Please provide company name")]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Please provide company contact number")]
    [Phone]
    public string ContactNumber { get; set; } = string.Empty;

}