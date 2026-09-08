using IndustrialAssets.Domain.Enums;
namespace IndustrialAssets.Application.DTOs;
public sealed record AssetDto(Guid Id, string Code, string Name, string Description, AssetType Type, string Manufacturer, string Model, string SerialNumber, AssetStatus Status, DateTimeOffset CreatedAt);
