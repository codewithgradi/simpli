using Microsoft.AspNetCore.Identity;

public interface ITokenService
{
    Task<string> GenerateAccessTokenAsync(AppUser user);
    string GenerateRefreshToken();
}