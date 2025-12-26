using Mapster;
using Microsoft.IdentityModel.Tokens;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace StudyApp.API.Services.Implementations
{
    public class ZoomService : IZoomService
    {
        private readonly IConfiguration _config;

        public ZoomService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateSignature(string meetingNumber, int role)
        {
            var sdkKey = _config["Zoom:SdkKey"];
            var sdkSecret = _config["Zoom:SdkSecret"];

            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var exp = now + 60 * 60 * 2; // 2 hours

            var payload = new JwtPayload
        {
            { "sdkKey", sdkKey },
            { "mn", meetingNumber },
            { "role", role },
            { "iat", now },
            { "exp", exp },
            { "appKey", sdkKey },
            { "tokenExp", exp }
        };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(sdkSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                new JwtHeader(credentials),
                payload
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
