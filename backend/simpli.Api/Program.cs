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

// 2. Clear default JSON sources for cloud hosting compatibility
// builder.Configuration.Sources.Clear();

// 3. Re-add JSON files
// builder.Configuration
//     .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
//     .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: false);

// 4. CRITICAL: Add environment variables LAST so .env overrides JSON placeholders
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();
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

app.MapOpenApi();

app.MapScalarApiReference(opt =>
{
    opt.WithTitle("Simpli API Docs")
       .WithTheme(ScalarTheme.DeepSpace)
       .WithOpenApiRoutePattern("/openapi/{documentName}.json");

    opt.AddPreferredSecuritySchemes("Bearer");
    opt.Servers = [new ScalarServer("https://api-simpli.onrender.com")];
});

app.UseHttpsRedirection();
app.UseCors("AllowNextJs");
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseAuthentication();

app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<AppUser>();
app.MapMcp("/mcp");
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
Console.WriteLine($"==> CONNECTED DB: {dbContext.Database.GetDbConnection().ConnectionString}");
app.Run();