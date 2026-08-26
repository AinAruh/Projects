using IndustrialAssets.Domain.Enums;
namespace IndustrialAssets.Domain.Entities;
public sealed class Asset
{
    public Guid Id { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public AssetType Type { get; set; }
    public required string Manufacturer { get; set; }
    public required string Model { get; set; }
    public required string SerialNumber { get; set; }
    public AssetStatus Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
