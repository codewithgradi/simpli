using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;

public class EmailService : IEmailService
{
    private readonly OtherSettings _settings;
    private readonly ILogger<EmailService> _logger;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public EmailService(IOptions<OtherSettings> settings, ILogger<EmailService> logger, HttpClient? httpClient,IConfiguration configuration)
    {
        _settings = settings.Value;
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClient;

        if (_settings == null)
        {
            throw new ArgumentNullException("Entire other setting is empty");
        }
        if (string.IsNullOrEmpty(_settings.SystemEmail))
        {
            throw new InvalidOperationException("OtherSettings:SystemEmail is null or empty! Check your environment variables.");
        }
        if (string.IsNullOrEmpty(_settings.AppPassword))
        {
            throw new InvalidOperationException("OtherSettings:AppPassword is null or empty! Check your environment variables.");
        }
    }

    public async Task SendPasswordResetEmailAsync(string email, string companyName, string resetToken)
    {
        string environment = _configuration["OtherSettings:CurrentEnviroment"] ?? "dev";

        // Fix: point to Prod vs Dev correctly
        string? url = environment == "prod"
            ? _configuration["OtherSettings:FrontEndUrlProd"]
            : _configuration["OtherSettings:FrontEndUrlDev"];

        if (string.IsNullOrEmpty(url) || url == "placeholder")
        {
            url = "https://simply-io.vercel.app";
        }

        string resetLink = $"{url}/code/reset?token={Uri.EscapeDataString(resetToken)}&email={Uri.EscapeDataString(email)}";

        var emailPayload = new
        {
            sender = new { name = "Support Team", email = _settings.SystemEmail },
            to = new[] { new { email = email, name = companyName } },
            subject = "Password Reset Request",

            htmlContent = $@"
                <div style='background-color: #ffffff; color: #111111; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; line-height: 1.5;'>
                    <h2 style='color: #111111; font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: left;'>Reset Your Password</h2>
                    
                    <p style='color: #555555; font-size: 14px; margin-bottom: 8px;'>Hi {companyName},</p>
                    <p style='color: #555555; font-size: 14px; margin-bottom: 24px;'>We received a request to reset your password. Click the button below to set up a new one:</p>
                    <p style='color: #555555; font-size: 14px; margin-bottom: 24px;'>You reset code is {resetToken}</p>
                    
                    <div style='margin: 28px 0;'>
                        <a href='{resetLink}' style='background-color: #10B981; color: #ffffff; padding: 10px 18px; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 4px; display: inline-block;'>Reset password</a>
                    </div>

                    <p style='font-size: 13px; color: #888888; margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 16px;'>
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>
                </div>"
    };

        // 3. Dispatch the HttpRequestMessage wrapper
        var request = new HttpRequestMessage(HttpMethod.Post, _settings.BrevoLink);
        request.Content = JsonContent.Create(emailPayload);
        request.Headers.Add("api-key", _settings.ApiKey!.Trim());

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            string errorLog = await response.Content.ReadAsStringAsync();
            throw new Exception($"Brevo submission failed: {response.StatusCode}\n{errorLog}");
        }
    }
}

public static class Utils
{
    public static string GenerateNumericResetCode()
    {
        //random 6-digit code
        int code = RandomNumberGenerator.GetInt32(100000, 1000000);
        return code.ToString();
    }
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