# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all project files explicitly
COPY ["simpli.Api/simpli.Api.csproj", "simpli.Api/"]
COPY ["simpli.Application/simpli.Application.csproj", "simpli.Application/"]
COPY ["simpli.Infrastructure/simpli.Infrastructure.csproj", "simpli.Infrastructure/"]
COPY ["simpli.Domain/simpli.Domain.csproj", "simpli.Domain/"]

# Run a global restore from the workspace root so it links them perfectly
RUN dotnet restore "simpli.Api/simpli.Api.csproj"

# Copy all remaining source code
COPY . .

# Build the app
WORKDIR "/src/simpli.Api"
RUN dotnet publish "simpli.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:DisableOpenApiAnalyzers=true /p:OpenApiGenerateDocuments=false /p:DisableOpenApiSourceGenerator=true
# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "simpli.Api.dll"]