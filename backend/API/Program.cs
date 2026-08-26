using System.Text.Json.Serialization; using IndustrialAssets.API.Middleware; using IndustrialAssets.Application.Interfaces; using IndustrialAssets.Application.Services; using IndustrialAssets.Infrastructure.Data; using IndustrialAssets.Infrastructure.Repositories; using Microsoft.EntityFrameworkCore;
var builder=WebApplication.CreateBuilder(args);
builder.Services.AddControllers().AddJsonOptions(options=>options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi(); builder.Services.AddDbContext<AssetsDbContext>(options=>options.UseNpgsql(builder.Configuration.GetConnectionString("AssetsDatabase"))); builder.Services.AddScoped<IAssetRepository,AssetRepository>(); builder.Services.AddScoped<IAssetService,AssetService>(); builder.Services.AddCors(options=>options.AddPolicy("Frontend",policy=>policy.WithOrigins(builder.Configuration["FrontendUrl"]??"http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
var app=builder.Build(); app.UseMiddleware<ExceptionMiddleware>(); app.UseCors("Frontend"); if(app.Environment.IsDevelopment())app.MapOpenApi(); app.MapControllers(); app.Run();
public partial class Program;
