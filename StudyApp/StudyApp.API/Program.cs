using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
//using StudyApp.API.Cloudinary;
using StudyApp.API.Data;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Hubs;
using StudyApp.API.Mappings;
using StudyApp.API.Middlewares;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// BunnyCDN

builder.Services.Configure<BunnySettings>(
    builder.Configuration.GetSection("BunnySettings"));


// Kestrel limits
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524_288_000;
});

// SignalR
builder.Services.AddSignalR();

// Repositories
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IPapersRepository, PapersRepository>();
builder.Services.AddScoped<IApplicationUserRepository, ApplicationUserRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IUserLoginRepository, UserLoginRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IOptionRepository, OptionRepository>();
builder.Services.AddScoped<IMockRepository, MockRepository>();
builder.Services.AddScoped<IMockQuestionRepository, MockQuestionRepository>();
builder.Services.AddScoped<IMockOptionRepository, MockOptionRepository>();
builder.Services.AddScoped<IStudentEnrollRepository, StudentEnrollRepository>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<ISubscriberRepository, SubscriberRepository>();
builder.Services.AddScoped<ILecturesRepository, LecturesRepository>();
builder.Services.AddScoped<ITestResultRepository, TestResultRepository>();
builder.Services.AddScoped<IAttemptRepository, AttemptRepository>();
builder.Services.AddScoped<IStudentLectureRepository, StudentLectureRepository>();
builder.Services.AddScoped<IBlogsRepository, BlogsRepository>();

builder.Services.AddHttpClient();

// Services
builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
builder.Services.AddScoped<ISessionServices, SessionServices>();
builder.Services.AddScoped<IPaperServices, PaperServices>();
builder.Services.AddScoped<IQuestionServices, QuestionServices>();
builder.Services.AddScoped<IOptionServices, OptionServices>();
builder.Services.AddScoped<IMockServices, MockServices>();
builder.Services.AddScoped<IMockQuestionServices, MockQuestionServices>();
builder.Services.AddScoped<IMockOptionServices, MockOptionServices>();
builder.Services.AddScoped<IStudentEnrollServices, StudentEnrollServices>();
builder.Services.AddScoped<IContactServices, ContactServices>();
builder.Services.AddScoped<ISubscriberServices, SubscriberServices>();
builder.Services.AddScoped<ILectureServices, LectureServices>();
builder.Services.AddScoped<ITestResultServices, TestResultServices>();
builder.Services.AddScoped<IAttemptService, AttemptService>();
builder.Services.AddScoped<IStudentLectureService, StudentLectureService>();
builder.Services.AddScoped<IBlogsServices, BlogsServices>();
builder.Services.AddScoped<ILiveClassService, LiveClassService>();

builder.Services.AddScoped<ZoomTokenService>();
builder.Services.AddScoped<ZoomMeetingService>();
builder.Services.AddScoped<IZoomService, ZoomService>();
builder.Services.AddScoped<IFileStorageService, BunnyStorageService>();
// Mapster
MappingConfig.RegisterMappings();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        ),
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("StudyApp", policy =>
    {
        policy
            .WithOrigins(
                "https://junoonmdcat.com",
                "https://www.junoonmdcat.com",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});



// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Static files
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads")
    ),
    RequestPath = "/api/uploads"
});

// Dev diagnostics
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "StudyApp API v1");
    c.RoutePrefix = "swagger";
});

// Pipeline order (IMPORTANT)
app.UseRouting();

app.UseCors("StudyApp");

app.UseAuthentication();
app.UseMiddleware<ValidateSessionMiddleware>();
app.UseAuthorization();

// Controllers
app.MapControllers();
// SignalR hub
app.MapHub<AttemptHub>("/hubs/attempt");
app.Run();
