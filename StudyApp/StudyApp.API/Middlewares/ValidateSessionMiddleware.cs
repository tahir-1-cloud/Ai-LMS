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
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                await _next(context);
                return;
            }

            var token = authHeader.Replace("Bearer ", "");

            var sessionExists = await db.UserLogins.AnyAsync(x =>
                x.Token == token &&
                x.ExpiresAt > DateTime.UtcNow &&
                !x.IsDeleted
            );

            if (!sessionExists)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            await _next(context);
        }
    }
}
