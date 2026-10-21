using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using simpli.Application.Services;
using simpli.Domain.Entities;

namespace simpli.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [ApiVersion("1.0")]
  public class CompanyController : ControllerBase
  {
    private readonly CompanyService _companyService;
    private readonly UserManager<AppUser> _userManager;
    private readonly AppDbContext _context;

    public CompanyController(CompanyService service, UserManager<AppUser> userManager,AppDbContext context)
    {
      _companyService = service;
      _userManager = userManager;
      _context=context;

    }

    [Authorize]
    [HttpGet(Name = "GetCompany")]
    public async Task<IActionResult> GetCompany()
    {
      var comapnyIdClaim = User.FindFirstValue("CompanyId");
      if (comapnyIdClaim == "0" || string.IsNullOrEmpty(comapnyIdClaim))
      {
        Console.WriteLine($"CompanyId : {comapnyIdClaim}");
        return Unauthorized("Invalid session");
      }
      var companyId = Convert.ToInt32(comapnyIdClaim);
      var company = await _companyService.GetCompanyProfile(companyId);
      if (company == null) return NotFound("No company profile found");
      return Ok(company);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateCompany(CreateCompanyDto createCompany)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (userId == null) return Unauthorized();
      var companydto = await _companyService.CreateCompany(createCompany, userId);

      if (companydto == null) return Unauthorized("Invalid session");
      return CreatedAtRoute(
        nameof(GetCompany),
        new { Id = companydto.Id },
        companydto
      );
    }


    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCompanyProfileDto dto)
    {
      if (!ModelState.IsValid) return BadRequest(ModelState);
      var companyId = Convert.ToInt32(User.FindFirst("CompanyId").Value);
      if (companyId == null) return Unauthorized("Invalid Session");

      var company = await _companyService.UpdateCompanyProfile(companyId, dto);
      if (company == null) return BadRequest("Could not update profile");
      return NoContent();
    }
    [Authorize]
    [HttpPatch("soft-delete")]
    public async Task<IActionResult> SoftDeleteProfile()
    {
      var companyId = Convert.ToInt32(User.FindFirst("CompanyId").Value);
      if (companyId == null) return Unauthorized("Invalid Session");
      await _companyService.SoftDeleteCompanyProfile(companyId);
      return NoContent();
    }
    [HttpPatch("reactivate")]
    public async Task<IActionResult> ReactivateProfile([FromBody] LoginRequest loginRequest)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(new { message = "Email and password are required." });
      }

      // 1. Fetch user and include the Company navigation property safely via your DbContext
      var user = await _context.Users
          .Include(u => u.Company)
          .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

      if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
      {
        return Unauthorized(new { message = "Invalid email or password." });
      }

      // 2. Ensure the user has a CompanyId assigned
      if (user.CompanyId == 0 || user.Company == null)
      {
        return BadRequest(new { message = "Associated company profile could not be found." });
      }

      // 3. Optional: Verify the company actually exists in the database to prevent KeyNotFoundException
      var companyExists = await _context.Companies.AnyAsync(c => c.Id == user.CompanyId);
      if (!companyExists)
      {
        return NotFound(new { message = "Company record no longer exists in the system." });
      }

      // 4. Safe to call reactivation
      await _companyService.ReactivateProfile(user.CompanyId);

      return Ok(new { message = "Profile successfully restored." });
    }
  }}