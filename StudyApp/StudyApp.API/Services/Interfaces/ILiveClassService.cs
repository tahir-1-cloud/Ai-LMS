using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;
using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface ILiveClassService
    {
        Task CreateLiveClassAsync(CreateLiveClassModel model);
        Task StartLiveClassAsync(int liveClassId);
        Task EndLiveClassAsync(int liveClassId);
        Task<StudentLiveClassModel?> GetActiveLiveClassForSession(int sessionId);
        Task<List<LiveClassModel>> GetLiveClassesForSessionAsync(int sessionId,int studentId);
        Task<List<LiveClassModel>> GetLiveClassesForSession_Admin(int sessionId);
        Task DeleteLiveClassAsync(int liveClassId);

    }

}
