using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace StudyApp.API.Services.Implementations
{
    public class ZoomTokenService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public ZoomTokenService(IConfiguration config, HttpClient http)
        {
            _config = config;
            _http = http;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var accountId = _config["ZoomApi:AccountId"];
            var clientId = _config["ZoomApi:ClientId"];
            var clientSecret = _config["ZoomApi:ClientSecret"];

            var auth = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}")
            );

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://zoom.us/oauth/token?grant_type=account_credentials&account_id={accountId}"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Basic", auth);

            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(json)
                .RootElement
                .GetProperty("access_token")
                .GetString()!;
        }
    }
}
