using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IStudentLectureRepository:IBaseRepository<Lecturedetails>
    {
        Task AssignLecturesToSessionAsync(int lectureId, int sessionId);
    }
}
