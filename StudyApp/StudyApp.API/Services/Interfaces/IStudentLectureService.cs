using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using System.Threading.Tasks;

namespace StudyApp.API.Services.Interfaces
{
    public interface IStudentLectureService
    {
        Task CreateLectureAsync(LectureDetailsModel model);

        Task<IEnumerable<LectureDetailsResponseDto>> GetAllLectures();
    }
}
