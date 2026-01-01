using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Migrations;
using StudyApp.API.Models;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IStudentLectureRepository:IBaseRepository<Lecturedetails>
    {
        Task AssignLecturesToSessionAsync(int lectureId, int sessionId);

        Task<StudentLecture?> GetLecturesSession(int lectureId, int sessionId);
        Task RemoveLecturesSession(StudentLecture entry);

        Task<List<int>> GetLectureAssignedSessionIdsAsync(int lectureId);

        Task DeleteLecturesAsync(int lectureId);

        Task<List<AssignedLectureDto>> GetAssignedLecturesAsync(int sessionId);
    }
}
