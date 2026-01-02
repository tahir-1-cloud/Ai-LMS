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
            if (context.Request.Method == HttpMethods.Options)
            {
                await _next(context);
                return;
            }

            var endpoint = context.GetEndpoint();

            if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
            {
                await _next(context);
                return;
            }
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var loginId = context.User.FindFirst("loginId")?.Value;

            if (userId == null || loginId == null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            var isValid = await db.UserLogins.AnyAsync(x =>
                x.Id == long.Parse(loginId) &&
                x.UserId == long.Parse(userId) &&
                x.ExpiresAt > DateTime.UtcNow &&
                x.IsActive);

            if (!isValid)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Session expired or logged out");
                return;
            }

            await _next(context);
        }

    }

}
