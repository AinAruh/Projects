using IndustrialAssets.Application.Services; using Microsoft.AspNetCore.Mvc;
namespace IndustrialAssets.API.Middleware;
public sealed class ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> logger)
{
 public async Task InvokeAsync(HttpContext context){try{await next(context);}catch(ConflictException ex){await WriteProblem(context,StatusCodes.Status409Conflict,ex.Message);}catch(Exception ex){logger.LogError(ex,"Unhandled request error");await WriteProblem(context,StatusCodes.Status500InternalServerError,"An unexpected error occurred.");}}
 private static async Task WriteProblem(HttpContext context,int status,string detail){context.Response.StatusCode=status;await context.Response.WriteAsJsonAsync(new ProblemDetails{Status=status,Title=status==409?"Resource conflict":"Server error",Detail=detail});}
}
