using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using simpli.Application.Dtos;
using simpli.Application.Services;
using Asp.Versioning;
using simpli.Domain.Exceptions;
using Microsoft.Extensions.AI;
using OpenAI;
using System.ClientModel;
namespace simpli.Infrastructure;

public static class ServiceExtentions
{
  public static IServiceCollection ConfigureMcp(this IServiceCollection services)
  {
    services
    .AddMcpServer()
    .WithHttpTransport(opt=>
    {
      opt.Stateless = true;
    })
    .WithToolsFromAssembly();
    return services;
  }
  public static IServiceCollection AddApiVersionForBackend(this IServiceCollection services)
  {
    services.AddApiVersioning(opt =>
    {
      //Default when not specified
      opt.AssumeDefaultVersionWhenUnspecified = true;
      opt.DefaultApiVersion = new ApiVersion(1, 0);

      opt.ReportApiVersions = true;

      //Tells .Net to look for querystring api-version
      opt.ApiVersionReader = new QueryStringApiVersionReader("api-version");
    });
    return services;
  }

  public static IServiceCollection LoadEnvironment(this IServiceCollection services, IConfiguration configuration)
  {
    DotNetEnv.Env.Load();
    var connectionStrings = new ConnnectionStrings();
    configuration.GetSection("ConnectionStrings").Bind(connectionStrings);
    services.Configure<ConnnectionStrings>(configuration.GetSection("ConnectionStrings"));
    services.Configure<OtherSettings>(configuration.GetSection("OtherSettings"));
    return services;
  }
  public static IServiceCollection ConfigureSqlDB(this IServiceCollection services, IConfiguration config)
{
    var envType = config["OtherSettings:CurrentEnviroment"]?.ToLower().Trim(' ', '"');

    if (string.IsNullOrWhiteSpace(envType) || envType.Equals("placeholder", StringComparison.OrdinalIgnoreCase))
    {
        envType = "dev";
    }

    services.AddDbContext<AppDbContext>(opt =>
    {
        string? rawConnectionString = envType switch
        {
            "dev" => config["ConnectionStrings:DevDB"],
            "prod" => config["ConnectionStrings:ProdDB"],
            _ => throw new InvalidOperationException($"Invalid environment target '{envType}'.")
        };

        string? connectionString = rawConnectionString?.Trim(' ', '"', '\'');

        if (string.IsNullOrWhiteSpace(connectionString) || 
            connectionString.Equals("placeholder", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"The connection string for '{envType}' is missing or still set to 'placeholder'. " +
                $"Checked key 'ConnectionStrings:{(envType == "dev" ? "DevDB" : "ProdDB")}'.");
        }

        opt.UseNpgsql(connectionString).UseSnakeCaseNamingConvention();
    });

    return services;
}
  public static IServiceCollection IdentityConfigurationsScope(this IServiceCollection services)
  {
    services.AddIdentityApiEndpoints<AppUser>(options =>
    {
      options.User.RequireUniqueEmail = true;
      options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    services.AddAuthorization();

    return services;
  }
  public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, AdditionalUserClaimsPrincipalFactory>();
    services.AddScoped<ICompanyRepo, CompanyRepo>();
    services.AddScoped<INotificationRepo, NotificationRepo>();
    services.AddScoped<IRoomRepo, RoomRepo>();
    services.AddScoped<IVisitorRepo, VisitorRepo>();

    services.AddScoped<CompanyService>();
    services.AddScoped<NotificationService>();
    services.AddScoped<VisitorService>();
    services.AddScoped<RoomServices>();

    services.AddHttpClient<IEmailService, EmailService>();

    return services;
  }
  public static IServiceCollection AllowCors(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddCors(opt =>
    {
      opt.AddPolicy("AllowNextJs", builder =>
      {
        var frontendUrlDev = configuration["OtherSettings:FrontEndUrl"]?.ToLower().Trim(' ', '"');
        var frontendUrlProd = configuration["OtherSettings:FrontEndUrlProd"]?.ToLower().Trim(' ', '"');
        var backendLiveApiLink = configuration["ConnectionStrings:BackendLiveApiLink"]?.ToLower().Trim(' ', '"');

        if (string.IsNullOrEmpty(frontendUrlDev) || string.IsNullOrEmpty(frontendUrlProd) || string.IsNullOrEmpty(backendLiveApiLink))
        {
          throw new ResourceNotFoundException("There are no front-end urls.");
        }

        builder.WithOrigins([frontendUrlDev, frontendUrlProd, backendLiveApiLink])
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
      });
    });

    return services;
  }
  public static IServiceCollection AddMappers(this IServiceCollection services)
  {
    services.AddSingleton<VisitorMappers>();
    services.AddSingleton<CompanyMappers>();
    services.AddSingleton<NotificationMappers>();
    services.AddSingleton<RoomMappers>();
    return services;
  }
  public static IServiceCollection AddOpenAI(this IServiceCollection services, IConfiguration configuration)
{
    string apiKey = configuration["OpenAi:ApiKey"]
        ?? throw new InvalidOperationException("Missing OpenAI api key in configuration.");

    // Retrieve OpenRouter URL from configuration (either top level or nested)
    string? openRouterUrl = configuration["OpenAi:OpenRouter"] ?? configuration["OpenRouter"];

    // Validate URI or fall back to standard OpenRouter base URL if missing or set to "Placeholder"
    if (string.IsNullOrWhiteSpace(openRouterUrl) ||
        openRouterUrl.Equals("Placeholder", StringComparison.OrdinalIgnoreCase) ||
        !Uri.TryCreate(openRouterUrl, UriKind.Absolute, out var openRouterUri))
    {
        openRouterUri = new Uri("https://openrouter.ai/api/v1");
    }

    var openAiOptions = new OpenAIClientOptions
    {
        Endpoint = openRouterUri
    };

    var openAiClient = new OpenAIClient(new ApiKeyCredential(apiKey), openAiOptions);

    IChatClient innerClient = openAiClient
        .GetChatClient("openrouter/free")
        .AsIChatClient();

    IChatClient chatClient = new ChatClientBuilder(innerClient)
        .UseFunctionInvocation()
        .Build();

    services.AddSingleton<IChatClient>(chatClient);

    return services;
}
}