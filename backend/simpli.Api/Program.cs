using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using simpli.Api.Mcp;
using simpli.Api.Middlewares;
using simpli.Infrastructure;

// 1. Load .env BEFORE creating builder so Environment.GetEnvironmentVariable is populated
var envPath = Path.Combine(Directory.GetCurrentDirectory(), "../.env");
if (File.Exists(envPath))
{
    DotNetEnv.Env.Load(envPath);
}
else
{
    DotNetEnv.Env.Load();
}

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args
});

// 2. Add environment variables so cloud settings override local settings
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddRouting(opt => { opt.LowercaseUrls = true; });
builder.Services.AddTransient<GlobalExceptionMiddleware>();
builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

// Background email processing
builder.Services.AddHangfire(config => config.UseMemoryStorage());
builder.Services.AddHangfireServer();

builder.Services
    .AddApiVersionForBackend()
    .LoadEnvironment(builder.Configuration)
    .ConfigureSqlDB(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration)
    .IdentityConfigurationsScope()
    .AllowCors(builder.Configuration)
    .AddMappers()
    .ConfigureMcp()
    .AddOpenAI(builder.Configuration);

builder.Services.AddScoped<CompanyTools>();
builder.Services.AddScoped<NotificationTools>();
builder.Services.AddScoped<RoomTools>();
builder.Services.AddScoped<VisitorTools>();
builder.Services.AddScoped<McpToolRegistery>();

var app = builder.Build();

// 3. RUN AUTOMATIC MIGRATIONS & VERIFY DB AT STARTUP
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Console.WriteLine($"==> CONNECTED DB: {dbContext.Database.GetDbConnection().ConnectionString}");

        if (dbContext.Database.IsRelational())
        {
            dbContext.Database.Migrate();
            Console.WriteLine("==> DB MIGRATIONS APPLIED SUCCESSFULLY");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[CRITICAL ERROR DURING DB MIGRATION]: {ex.GetType().Name} - {ex.Message}");
    }
}

// 4. OpenAPI & Scalar UI Routes
app.UseSwagger(c =>
{
    c.RouteTemplate = "openapi/{documentName}.json";
});

app.MapScalarApiReference(opt =>
{
    opt.WithTitle("Simpli API Docs")
       .WithTheme(ScalarTheme.DeepSpace)
       .WithOpenApiRoutePattern("/openapi/v1.json");
});

// 5. CORRECT MIDDLEWARE PIPELINE ORDER
// Place Exception Handler first so ALL downstream pipeline errors are caught and logged
app.UseMiddleware<GlobalExceptionMiddleware>();

// Enable CORS for Next.js frontend as well as live Scalar UI
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// 6. MAP ENDPOINTS
app.MapControllers();
app.MapIdentityApi<AppUser>();
app.MapMcp("/mcp");

app.Run();