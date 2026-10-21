using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using simpli.Application.Dtos;
using simpli.Application.Dtos.Auth;
using simpli.Application.Services;
using simpli.Domain.Entities;

namespace simpli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly CompanyService _service;
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IMemoryCache _cache;
    public AuthController(
        CompanyService companyService,
    UserManager<AppUser> userManager,
     SignInManager<AppUser> signInManager,
     ITokenService tokenService,
     AppDbContext context,
     IEmailService emailService,
     IMemoryCache cache


     )
    {
        _service = companyService;
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _context = context;
        _emailService = emailService;
        _cache=cache;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new AppUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                Message = "Registration failed.",
                Errors = result.Errors.Select(e => e.Description)
            });
        }

        var companyProfileBody = new CreateCompanyDto
        {
            CompanyName = registerDto.CompanyName,
            ContactNumber = registerDto.ContactNumber,
            RegistrationNumber = registerDto.RegistrationNumber,
            Website = string.Empty
        };

        var appUserId = user.Id.ToString();

        var profileCreateResponse = await _service.CreateCompany(companyProfileBody, appUserId);

        if (profileCreateResponse == null)
        {
            await _userManager.DeleteAsync(user);
            return BadRequest(new { Message = "Failed to create company profile. Registration rolled back." });
        }

        user.CompanyId = profileCreateResponse.Id;
        await _userManager.UpdateAsync(user);

        return Ok(new { Message = "Registration was successful." });
    }
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> LogOut()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "user logged out" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "email and password are required" });
        }

        var user = await _context.Users
        .Include(x => x.Company)
        .FirstOrDefaultAsync(x => x.Email == loginRequest.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
        {
            return Unauthorized(new { message = "invalid email or password" });
        }

        if (user.Company != null && user.Company.isDeleted)
        {
            return Unauthorized(new { message = "account is deactivated, please reactivate" });
        }

        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var refreshToken = _tokenService.GenerateRefreshToken();


        var response = new LoginResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 3600
        };

        return Ok(response);
    }
    [HttpPost("sendCode")]
    public async Task<IActionResult> SendResetCode([FromBody] SendCode sendCodeDto)
    {
        var user = await _context.Users.Include(c => c.Company).FirstOrDefaultAsync(e => e.Email == sendCodeDto.Email);
        if (user == null)
        {
            return BadRequest(new { message = "Email was not found, please register" });
        }

        var companyName = user.Company?.CompanyName ?? "Our Platform";

        var resetCode = Utils.GenerateNumericResetCode(); 

        // Store the code in memory with a 4-minute absolute expiration
        var cacheKey = $"ResetCode_{sendCodeDto.Email}";
        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(4));

        _cache.Set(cacheKey, resetCode, cacheEntryOptions);

        await _emailService.SendPasswordResetEmailAsync(sendCodeDto.Email, companyName, resetCode);
        return Ok(new { message = "Password reset code has been sent." });
    }

    [HttpPost("resetPassword")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePassword updatePasswordDto)
    {
        var user = await _context.Users
            .Include(x => x.Company)
            .FirstOrDefaultAsync(x => x.Email == updatePasswordDto.Email);

        if (user == null)
        {
            return BadRequest(new { message = "Email was not found, please register" });
        }

        if (updatePasswordDto.ConfirmedPassword != updatePasswordDto.NewPassword)
        {
            return BadRequest(new { message = "Confirmed password is not the same as new password" });
        }

        // 1. Verify code entered matches the code stored in memory
        var cacheKey = $"ResetCode_{updatePasswordDto.Email}";
        if (!_cache.TryGetValue(cacheKey, out string? storedCode) || storedCode != updatePasswordDto.ResetCode.ToString())
        {
            return BadRequest(new { message = "Invalid or expired reset code." });
        }

        _cache.Remove(cacheKey);

        var removePasswordResult = await _userManager.RemovePasswordAsync(user);
        if (!removePasswordResult.Succeeded)
        {
            return BadRequest(new { message = "Failed to reset password." });
        }

        var addPasswordResult = await _userManager.AddPasswordAsync(user, updatePasswordDto.NewPassword);
        if (!addPasswordResult.Succeeded)
        {
            return BadRequest(new { errors = addPasswordResult.Errors });
        }

        return Ok(new { message = "Password was updated successfully" });
    }
};

