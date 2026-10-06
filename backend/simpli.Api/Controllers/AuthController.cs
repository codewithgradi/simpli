using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using simpli.Application.Dtos.Auth;
using simpli.Application.Services;
using simpli.Domain.Entities;

namespace simpli.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CompanyService _service;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(CompanyService companyService, UserManager<AppUser> userManager)
        {
            _service = companyService;
            _userManager = userManager;
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

            return Ok(new { Message = "Registration was successful." });
        }
    }
}