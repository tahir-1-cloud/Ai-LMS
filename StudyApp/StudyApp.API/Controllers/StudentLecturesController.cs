using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentLecturesController : ControllerBase
    {
        private readonly IStudentLectureService _studentLectureService;

        public StudentLecturesController(IStudentLectureService studentLectureService)
        {
            _studentLectureService = studentLectureService;
        }

        [HttpPost]
        [RequestSizeLimit(524_288_000)]
        public async Task<IActionResult> UploadLectures([FromForm] LectureDetailsModel model)
        {         
            try
            {
                if (model == null) return BadRequest("Model is required.");
                if (model.Thumbnail == null || model.Video == null) return BadRequest("Thumbnail and Video are required.");

                await _studentLectureService.CreateLectureAsync(model);
                return Created();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLectures()
        {
            try
            {
               var  lecture = await _studentLectureService.GetAllLectures();
                return Ok(lecture);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AssignToSession([FromBody] AssignLectureDto dto)
        {
            try
            {
                await _studentLectureService.AssignLectureToSession(dto.LectureId, dto.SessionId);
                return Ok();
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(knf.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
