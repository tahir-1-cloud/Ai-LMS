using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using System.Security.Claims;

namespace StudyApp.API.Services
{
    public class SessionValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ApplicationDbContext db)
        {
            var endpoint = context.GetEndpoint();
            if (endpoint?.Metadata?.GetMetadata<AllowAnonymousAttribute>() != null)
            {
                await _next(context);
                return;
            }

            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var loginId = context.User.FindFirstValue("loginId");

            if (userId == null || loginId == null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            var validSession = await db.UserLogins.AnyAsync(x =>
                x.Id == long.Parse(loginId) &&
                x.UserId == long.Parse(userId) &&
                x.ExpiresAt > DateTime.UtcNow &&
                x.IsActive);

            if (!validSession)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Session expired or logged out");
                return;
            }

            await _next(context);
        }

    }

}
