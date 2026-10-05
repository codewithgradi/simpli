using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public CompanyController(CompanyService service)
    {
      _companyService = service;

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
    [Authorize]
    [HttpPatch("reactivate")]
    public async Task<IActionResult> ReactivateProfile()
    {
      var companyId = Convert.ToInt32(User.FindFirst("CompanyId").Value);
      if (companyId == null) return Unauthorized("Invalid Session");
      await _companyService.ReactivateProfile(companyId);
      return NoContent();
    }

  }
}