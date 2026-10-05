namespace simpli.Api.Middlewares;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using simpli.Domain.Exceptions;
using System.Net;
using System.Text.Json;

public class GlobalExceptionMiddleware : IMiddleware
{
  private readonly ILogger<GlobalExceptionMiddleware> _logger;

  public GlobalExceptionMiddleware(ILogger<GlobalExceptionMiddleware> logger)
  {
    _logger = logger;
  }
  public async Task InvokeAsync(HttpContext context, RequestDelegate next)
  {
    try
    {
      await next(context);
    }
    catch (Exception e)
    {
      _logger.LogError(e, "An unhandled exception occured {Message}", e.Message);
      await HandleExceptionAsync(context, e);
    }
  }
  private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
  {
    context.Response.ContentType = "application/json";

    //Defaults
    var statusCode = HttpStatusCode.InternalServerError;
    var title = "server error";
    var message = "A serious system error occured on the server";

    switch (exception)
    {
      case ResourceNotFoundException:
        statusCode = HttpStatusCode.NotFound;
        title = "Not Found";
        message = exception.Message;
        break;
      case BusinessRuleException:
        statusCode = HttpStatusCode.BadRequest;
        title = "Bad Request";
        message = exception.Message;
        break;
      case ResourceConflictException:
        statusCode = HttpStatusCode.Conflict;
        title = "Conflict";
        message = exception.Message;
        break;
      case UnauthorizedException:
        statusCode = HttpStatusCode.Unauthorized;
        title = "Unauthorized";
        message = exception.Message;
        break;
      case DbUpdateException dbUpdateException:
        statusCode = HttpStatusCode.BadRequest;
        title = "Database Error";
        message = dbUpdateException.InnerException != null
        ? dbUpdateException.InnerException.Message
        : dbUpdateException.Message;
        break;
      default:
        if (exception.Message.StartsWith("Could not send email"))
        {
          statusCode = HttpStatusCode.BadRequest;
          title = "Email Delivery Failure";
          message = exception.Message;
        }
        break;
    }
    context.Response.StatusCode = (int)statusCode;
    var response = new ProblemDetails
    {
      Status = (int)(statusCode),
      Title = title,
      Detail = message,
      Instance = context.Request.Path
    };

    var jsonOptions = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    await
     context
    .Response
    .WriteAsync(
      JsonSerializer
      .Serialize(
        response,
        jsonOptions)
        );
  }
}