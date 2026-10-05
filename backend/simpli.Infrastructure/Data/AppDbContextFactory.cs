using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.IO;

namespace simpli.Infrastructure;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var currentDir = new DirectoryInfo(Directory.GetCurrentDirectory());
        string? envFilePath = null;

        // Traverse up parent directories until we find a .env file
        while (currentDir != null)
        {
            var candidatePath = Path.Combine(currentDir.FullName, ".env");
            if (File.Exists(candidatePath))
            {
                envFilePath = candidatePath;
                break;
            }
            currentDir = currentDir.Parent;
        }

        if (envFilePath != null)
        {
            // Load environment variables overwriting any existing process variables
            DotNetEnv.Env.Load(envFilePath);
            Console.WriteLine($"[EF Factory Debug]: Loaded .env from '{envFilePath}'");
        }
        else
        {
            throw new FileNotFoundException(
                $"[EF Factory Error]: Could not locate '.env' file in '{Directory.GetCurrentDirectory()}' or any parent directory.");
        }

        // Check all common key variations
        var rawConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings__ProdDB")
            ?? Environment.GetEnvironmentVariable("ConnectionStrings__DevDB")
            ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");

        var connectionString = rawConnectionString?.Trim('"', '\'');

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"[EF Factory Error]: Found '.env' at '{envFilePath}', but no valid connection string key (ConnectionStrings__ProdDB, ConnectionStrings__DevDB, ConnectionStrings__DefaultConnection, or DATABASE_URL) was populated.");
        }

        // Print host details so you can verify target DB before applying
        var builder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
        Console.WriteLine($"[EF Factory Target Host]: {builder.Host} | Database: {builder.Database}");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString).UseSnakeCaseNamingConvention();

        return new AppDbContext(optionsBuilder.Options);
    }
}