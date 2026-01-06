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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
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

        [HttpPost]
        public async Task<IActionResult> UnassignFromSession([FromBody] AssignLectureDto model)
        {
            try
            {
                await _studentLectureService.UnassignLectureFromSession(model.LectureId, model.SessionId);
                return Ok("Lecture unassigned successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLectureAssignments([FromQuery] int lectureId)
        {
            var sessionIds = await _studentLectureService
                .GetLectureAssignedSessionId(lectureId);

            return Ok(sessionIds.Select(id => new { sessionId = id }));
        }


        [HttpDelete("{lectureId}")]
        public async Task<IActionResult> DeleteLecturesLinkwithstudents(int lectureId)
        {
            try
            {
                await _studentLectureService.DeleteLecture(lectureId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                // log ex if you have logger
                return BadRequest(ex.Message);
            }
        }

        //show lectures to students

        [HttpGet]
        public async Task<IActionResult> GetAssignedLectures()
        {
           
            int sessionId = int.Parse(User.FindFirst("sessionId")!.Value);

            var lectures = await _studentLectureService.GetAssignedLectures(sessionId);

            return Ok(lectures);
        }
    }
}
