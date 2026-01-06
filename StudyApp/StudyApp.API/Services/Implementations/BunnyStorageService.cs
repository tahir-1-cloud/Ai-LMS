using Microsoft.Extensions.Options;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class BunnyStorageService : IFileStorageService
    {
        private readonly BunnySettings _settings;
        private readonly HttpClient _httpClient;

        public BunnyStorageService(
            IOptions<BunnySettings> settings,
            HttpClient httpClient)
        {
            _settings = settings.Value;
            _httpClient = httpClient;

            // ✅ Correct header
            _httpClient.DefaultRequestHeaders.Add("AccessKey", _settings.AccessKey);
        }

        public async Task<string> UploadAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required");

            var isVideo = file.ContentType.StartsWith("video/");
            var folder = isVideo ? "lecture_videos" : "lecture_thumbnails";

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";

            // ✅ Correct Bunny Storage API URL
            var uploadUrl =
                $"https://{_settings.StorageHost}/{_settings.StorageZoneName}/{folder}/{fileName}";

            await using var stream = file.OpenReadStream();
            using var content = new StreamContent(stream);

            content.Headers.ContentType =
                new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            var response = await _httpClient.PutAsync(uploadUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Bunny upload failed: {error}");
            }

            // ✅ CDN URL for public access
            return $"{_settings.CdnUrl}/{folder}/{fileName}";
        }
    }
}

