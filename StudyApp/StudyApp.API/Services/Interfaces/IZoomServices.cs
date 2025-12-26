using StudyApp.API.Models;

namespace StudyApp.API.Services.Interfaces
{
    public interface IZoomService
    {
        string GenerateSignature(string meetingNumber, int role);
    }

}
