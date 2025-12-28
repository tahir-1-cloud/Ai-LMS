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
    public class BlogController : ControllerBase
    {
        private readonly IBlogsServices  _blogServices;
        private readonly IWebHostEnvironment _env;
        public BlogController(IBlogsServices blogsServices, IWebHostEnvironment env)
        {
            _blogServices = blogsServices;
            _env = env;
        }
        [HttpPost]
        public async Task<IActionResult> AddBlogs([FromForm] BlogsModel blogsModel)
        {
            try
            {
                if (blogsModel.Image == null)
                    return BadRequest("Image is missing!");
                string webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string uploadFolder = Path.Combine(webRoot, "uploads");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                string fileName = Guid.NewGuid() + Path.GetExtension(blogsModel.Image.FileName);
                string fullPath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await blogsModel.Image.CopyToAsync(stream);
                }

                string imagePath = $"/uploads/{fileName}";

                var lectureDto = new BlogsDto
                {
                    Title = blogsModel.Title,
                    ShortDescription = blogsModel.ShortDescription,
                    Content = blogsModel.Content,
                    ImageUrl = imagePath
                };

                await _blogServices.AddBlogs(lectureDto);
                return Created("", lectureDto);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBlogs()
        {
            try
            {
                IEnumerable<BlogsDto> blogs = await _blogServices.GetBlogs();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("{blogId}")]
        public async Task<IActionResult> GetBlogDetails(int blogId)
        {
            try
            {
                var blog = await _blogServices.BlogsDetails(blogId);

                if (blog == null)
                    return NotFound(new { message = $"Blog with ID {blogId} not found." });

                return Ok(blog);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpDelete("{blogsId}")]
        public async Task<IActionResult> DeleteBlogs(int blogsId)
        {
            try
            {
                await _blogServices.DeleteBlogs(blogsId);
                return NoContent();
            }
            catch (Exception ex)
            {
                // log ex if you have logger
                return BadRequest(ex.Message);
            }
        }
    }
}
