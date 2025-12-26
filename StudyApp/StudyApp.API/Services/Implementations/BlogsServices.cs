using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class BlogsServices: IBlogsServices
    {
        private readonly IBlogsRepository  _blogsRepository;

        public BlogsServices(IBlogsRepository blogsRepository)
        {
            _blogsRepository= blogsRepository;
        }

        public async Task AddBlogs(BlogsDto model)
        {
            var blogs = new Blogs
            {
                Title = model.Title,
                ImageUrl = model.ImageUrl,
                ShortDescription = model.ShortDescription,
                Content = model.ShortDescription,
                CreatedAt = DateTime.UtcNow
            };
            await _blogsRepository.AddAsync(blogs);
        }

        public async Task<IEnumerable<BlogsDto>> GetBlogs()
        {
            IEnumerable<Blogs> enumerable = await _blogsRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<BlogsDto>>();
        }

        public async Task DeleteBlogs(int blogsId)
        {
            await _blogsRepository.DeleteBlogsAsync(blogsId);
        }
    }
}
