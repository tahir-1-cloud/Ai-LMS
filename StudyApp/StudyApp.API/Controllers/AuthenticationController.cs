using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationServices _authenticationServices;

        public AuthenticationController(IAuthenticationServices authenticationServices)
        {
            _authenticationServices = authenticationServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent([FromBody] CreateApplicationUserModel request)
        {
            try
            {
                CreateApplicationUserModel createApplicationUserModel = await _authenticationServices.AddNewStudent(request);
                return Ok(createApplicationUserModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> LoginStudent([FromBody] LoginModel request)
        {
            try
            {
                LoginResponse loginResponse = await _authenticationServices.LoginStudent(request);
                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                IEnumerable<ApplicationUserModel> enumerable = await _authenticationServices.GetAllStudent();
                return Ok(enumerable);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/block-status")]
        public async Task<IActionResult> SetBlockStatus(int id, [FromQuery] bool isBlocked)
        {
            var result = await _authenticationServices.SetStudentBlockStatusAsync(id, isBlocked);

            if (!result)
                return NotFound(new { message = "Student not found" });

            return Ok(new
            {
                message = isBlocked
                    ? "Student blocked successfully"
                    : "Student unblocked successfully"
            });
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            var result = await _authenticationServices.LogoutAsync(User);

            if (!result)
                return BadRequest(new { message = "Unable to logout" });

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetTotalStudents()
        {
            try
            {
                int totalStudents = await _authenticationServices.GetTotalstudents();
                return Ok(totalStudents);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }

}
