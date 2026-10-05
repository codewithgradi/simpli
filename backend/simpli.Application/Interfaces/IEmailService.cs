public interface IEmailService
{
  Task SendVisitorEmailAsync(string email, string firstName, string roomNumber, string passCode);
}