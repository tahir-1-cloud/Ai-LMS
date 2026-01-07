using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;

namespace StudyApp.API.Middlewares
{
    public class ValidateSessionMiddleware
    {
        private readonly RequestDelegate _next;

        public ValidateSessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ApplicationDbContext db)
        {
            // ✅ 1️⃣ Allow CORS preflight
            if (context.Request.Method == HttpMethods.Options)
            {
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            // ✅ 2️⃣ No token → let controller decide
            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                await _next(context);
                return;
            }

            var token = authHeader["Bearer ".Length..].Trim();

            var sessionExists = await db.UserLogins.AnyAsync(x =>
                x.Token == token &&
                x.ExpiresAt > DateTime.UtcNow &&
                !x.IsDeleted
            );

            if (!sessionExists)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Session expired or invalid");
                return;
            }

            await _next(context);
        }
    }
}
