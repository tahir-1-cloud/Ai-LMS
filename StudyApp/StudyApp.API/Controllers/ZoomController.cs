using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ZoomController : ControllerBase
    {
        private readonly IZoomService _zoomService;

        public ZoomController(IZoomService zoomService)
        {
            _zoomService = zoomService;
        }

        [HttpGet("signature")]
        public IActionResult GetSignature(
            [FromQuery] string meetingNumber,
            [FromQuery] int role = 0
        )
        {
            if (string.IsNullOrWhiteSpace(meetingNumber))
                return BadRequest("Meeting number is required");

            var signature = _zoomService.GenerateSignature(meetingNumber, role);
            return Ok(new { signature });
        }
    }
}
