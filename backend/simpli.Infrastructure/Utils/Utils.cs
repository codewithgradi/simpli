using System.Security.Cryptography;
using QRCoder;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Utils;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;


public class EmailService : IEmailService
{
  private readonly OtherSettings _setings;
  private readonly ILogger<EmailService> _logger;
  private readonly HttpClient _httpClient;

  public EmailService(IOptions<OtherSettings> settings, ILogger<EmailService> logger, HttpClient? httpClient)
  {
    _setings = settings.Value;
    _logger = logger;
    _httpClient = httpClient;

    if (_setings == null)
    {
      throw new ArgumentNullException("Entire other setting is empty");
    }
    if (string.IsNullOrEmpty(_setings.SystemEmail))
    {
      throw new InvalidOperationException("OtherSettings:SystemEmail is null or empty! Check your environment variables.");
    }

    if (string.IsNullOrEmpty(_setings.AppPassword))
    {
      throw new InvalidOperationException("OtherSettings:AppPassword is null or empty! Check your environment variables.");
    }
  }
  public async Task SendVisitorEmailAsync(string email, string firstName, string roomNumber, string data)
  {
    // 1. Generate the QR Code with specific colors 
    using var qrGenerator = new QRCodeGenerator();
    using var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);

    using var qrCode = new PngByteQRCode(qrCodeData);

    byte[] darkColor = new byte[] { 0x00, 0xED, 0x64 };
    byte[] lightColor = new byte[] { 0x00, 0x1E, 0x2B };
    byte[] qrCodeBytes = qrCode.GetGraphic(20, darkColor, lightColor, true);

    // FIX: Convert the raw bytes to a proper Base64 encoded string text string
    string base64QrCode = Convert.ToBase64String(qrCodeBytes);

    // 2. Prepare the payload for Brevo's API with an inline attachment mapping
    var emailPayload = new
    {
      sender = new { name = "Check-in System", email = _setings.SystemEmail },
      to = new[] { new { email = email, name = firstName } },
      subject = $"Your Exit Pass - {firstName}",

      // FIX: Point the image source directly to the filename of your attachment
      htmlContent = $@"
        <div style='background-color: #001E2B; color: #ffffff; padding: 40px; text-align: center; font-family: sans-serif; border-radius: 15px;'>
            <h1 style='color: #00ED64;'>Check-in Successful</h1>
            <p style='color: #8899A6;'>Welcome to Room {roomNumber}, {firstName}.</p>
            <p style='color: #8899A6;'>See attached image for exit pass.</p>
            <p style='font-size: 14px;'>Passcode: <br/> 
               <span style='font-family: monospace; font-size: 18px; color: #00ED64;'>{Utils.GetPassCodeUtility(data)}</span>
            </p>
        </div>",

      // Add the file mapping to Brevo's attachment array metadata
      attachment = new[]
        {
            new
            {
                content = base64QrCode,
                name = "exit-pass.png"
            }
        }
    };

    // 3. Dispatch the explicit HttpRequestMessage wrapper
    var request = new HttpRequestMessage(HttpMethod.Post, _setings.BrevoLink);
    request.Content = JsonContent.Create(emailPayload);

    request.Headers.Add("api-key", _setings.ApiKey!.Trim());

    var response = await _httpClient.SendAsync(request);

    if (!response.IsSuccessStatusCode)
    {
      string errorLog = await response.Content.ReadAsStringAsync();
      throw new Exception($"Brevo submission failed: {response.StatusCode} - {errorLog}");
    }
  }
}

public static class Utils
{
  public static string GetPassCodeUtility(string data)
  {
    int positionOfPeriod = data.IndexOf('.');
    return data.Substring(0, positionOfPeriod);
  }
  public static string GetRoomIdUtility(string data)
  {
    int positionOfPeriod = data.IndexOf('.');
    return data.Substring(positionOfPeriod);
  }
  public static string GeneratePasscode(int roomId)
  {
    int passcode = RandomNumberGenerator.GetInt32(1000, 10000);
    string result = $"{passcode.ToString()}.{roomId.ToString()}";
    return result;
  }
}