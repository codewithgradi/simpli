using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.IO;

namespace simpli.Infrastructure;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        // 1. Get the starting directory where the EF Core command was run
        var currentDir = Directory.GetCurrentDirectory();
        var directoryInfo = new DirectoryInfo(currentDir);
        string rootDirectory = null;

        // 2. Walk up the directory tree until we find the solution root (simpli_v3)
        while (directoryInfo != null)
        {
            if (directoryInfo.Name.Equals("simpli_v3", StringComparison.OrdinalIgnoreCase))
            {
                rootDirectory = directoryInfo.FullName;
                break;
            }
            directoryInfo = directoryInfo.Parent;
        }

        // Fallback: If we couldn't find the specific root folder name, use current directory
        if (string.IsNullOrEmpty(rootDirectory))
        {
            rootDirectory = currentDir;
        }

        // 3. Locate and load the .env file
        var envFilePath = Path.Combine(rootDirectory, ".env");

        if (File.Exists(envFilePath))
        {
            DotNetEnv.Env.Load(envFilePath);
        }
        else
        {
            throw new FileNotFoundException(
                $"[EF Factory Error]: Still looking for the .env file!\n" +
                $"Checked path: '{envFilePath}'\n" +
                $"Current Working Directory was: '{currentDir}'\n" +
                $"Please verify your .env file is located at the root of your workspace.");
        }

        // 4. Read your DevDB connection string and safely trim any literal quotes
        var rawConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DevDB");
        var connectionString = rawConnectionString?.Trim('"', '\'');

        // 5. Guard clause validation check
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"[EF Factory Error]: Found your .env file at '{envFilePath}', but the key 'ConnectionStrings__DevDB' is empty or missing inside it.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString).UseSnakeCaseNamingConvention();

        return new AppDbContext(optionsBuilder.Options);
    }
}