using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using System.Security.Claims;

namespace StudyApp.API.Services.Interfaces
{
    public interface IAuthenticationServices
    {
        public Task<CreateApplicationUserModel> AddNewStudent(CreateApplicationUserModel student);
        public Task<LoginResponse> LoginStudent(LoginModel student);

        public Task<IEnumerable<ApplicationUserModel>> GetAllStudent();

        Task<bool> SetStudentBlockStatusAsync(int studentId, bool isBlocked);
        Task<bool> LogoutAsync(ClaimsPrincipal user);

    }
}
