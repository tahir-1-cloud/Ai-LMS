using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;
using System.Security.Claims;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LiveClassController : ControllerBase
    {
        private readonly ILiveClassService _service;
        private readonly IZoomService _zoomService;

        public LiveClassController(ILiveClassService service, IZoomService zoomService)
        {
            _service = service;
            _zoomService = zoomService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLiveClassModel model)
        {
            try
            {
                await _service.CreateLiveClassAsync(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        [HttpPost("{id}/start")]
        public async Task<IActionResult> Start(int id)
        {
            try
            {
                await _service.StartLiveClassAsync(id);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // 🔥 THIS IS KEY
            }
        }


        [HttpPost("{id}/end")]
        public async Task<IActionResult> End(int id)
        {
            await _service.EndLiveClassAsync(id);
            return Ok();
        }

        [HttpGet("session/{sessionId}")]
        public async Task<IActionResult> GetForSession(int sessionId)
        {
            var result = await _service.GetActiveLiveClassForSession(sessionId);
            return Ok(result);
        }

        [HttpGet("signature")]
        public IActionResult GetSignature([FromQuery] string meetingNumber,[FromQuery] int role)
        {
            var signature = _zoomService.GenerateSignature(meetingNumber, role);
            return Ok(new { signature });
        }

        [HttpGet("session/{sessionId}/all")]
        public async Task<IActionResult> GetAllForSession(int sessionId)
        {
            int studentId = int.Parse(
                            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? throw new UnauthorizedAccessException("User id not found in token")
                        );
            var result = await _service.GetLiveClassesForSessionAsync(sessionId,studentId);
            return Ok(result);
        }
        [HttpGet("admin/session/{sessionId}/all")]
        public async Task<IActionResult> GetAllForSession_Admin(int sessionId)
        {
            var result = await _service.GetLiveClassesForSession_Admin(sessionId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteLiveClassAsync(id);
            return Ok("Live class deleted");
        }

    }
}
