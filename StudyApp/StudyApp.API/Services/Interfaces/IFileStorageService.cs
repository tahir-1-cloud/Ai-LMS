namespace StudyApp.API.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadAsync(IFormFile file);

    }
}
