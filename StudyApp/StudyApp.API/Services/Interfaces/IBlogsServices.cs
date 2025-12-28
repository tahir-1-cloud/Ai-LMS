using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IBlogsServices
    {
        Task AddBlogs(BlogsDto model);

        Task<IEnumerable<BlogsDto>> GetBlogs();

        Task DeleteBlogs(int blogsId);

        Task<BlogDetailsDto> BlogsDetails(int blogsId);
    }
}
