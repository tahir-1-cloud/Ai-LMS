using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace StudyApp.API.Services.Implementations
{
    public class ZoomMeetingService
    {
        private readonly ZoomTokenService _tokenService;
        private readonly HttpClient _http;

        public ZoomMeetingService(ZoomTokenService tokenService, HttpClient http)
        {
            _tokenService = tokenService;
            _http = http;
        }

        public async Task<(string id, string startUrl, string joinUrl, string password)>
            CreateMeetingAsync(string topic, DateTime startTime, int duration)
        {
            var token = await _tokenService.GetAccessTokenAsync();

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.zoom.us/v2/users/me/meetings"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var payload = new
            {
                topic,
                type = 2,
                start_time = startTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"),
                duration,
                settings = new
                {
                    join_before_host = false,
                    waiting_room = true
                }
            };

            request.Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync())
                .RootElement;

            return (
                json.GetProperty("id").GetInt64().ToString(),
                json.GetProperty("start_url").GetString()!,
                json.GetProperty("join_url").GetString()!,
                json.GetProperty("password").GetString()!
            );
        }
    }
}
