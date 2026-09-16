using IndustrialAssets.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
namespace IndustrialAssets.API.Middleware;

public sealed class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ConflictException ex)
        {
            await WriteProblemAsync(context, StatusCodes.Status409Conflict, ex.Message);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.UniqueViolation })
        {
            await WriteProblemAsync(context, StatusCodes.Status409Conflict,
                "Código ou número de série já cadastrado.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled request error");
            await WriteProblemAsync(context, StatusCodes.Status500InternalServerError,
                "Não foi possível concluir a operação.");
        }
    }

    private static Task WriteProblemAsync(HttpContext context, int status, string detail)
    {
        context.Response.StatusCode = status;
        return context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = status,
            Title = status == StatusCodes.Status409Conflict ? "Conflito de dados" : "Erro interno",
            Detail = detail
        });
    }
}
