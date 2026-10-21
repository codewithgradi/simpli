public interface IEmailService
{
  Task SendPasswordResetEmailAsync(string email, string companyName, string resetToken);
}