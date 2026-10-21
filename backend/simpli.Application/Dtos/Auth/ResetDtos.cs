using System.ComponentModel.DataAnnotations;

namespace simpli.Application.Dtos;

public class SendCode
{
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; } = string.Empty;
}
public class UpdatePassword
{
   
    [Required(ErrorMessage = "new password is required.")]

    public string NewPassword { get; set; } = string.Empty;
    [Required(ErrorMessage = "confirmed password is required.")]

    public string ConfirmedPassword { get; set; } = string.Empty;
    [Required(ErrorMessage = "reset code is required.")]

    public int ResetCode { get; set; }
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; } = string.Empty;

}