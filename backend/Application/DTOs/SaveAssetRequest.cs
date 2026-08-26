using System.ComponentModel.DataAnnotations;
using IndustrialAssets.Domain.Enums;
namespace IndustrialAssets.Application.DTOs;
public sealed class SaveAssetRequest
{
    [Required, StringLength(30, MinimumLength = 2)] public string Code { get; init; } = string.Empty;
    [Required, StringLength(120, MinimumLength = 2)] public string Name { get; init; } = string.Empty;
    [StringLength(500)] public string Description { get; init; } = string.Empty;
    [EnumDataType(typeof(AssetType))] public AssetType Type { get; init; }
    [Required, StringLength(100)] public string Manufacturer { get; init; } = string.Empty;
    [Required, StringLength(100)] public string Model { get; init; } = string.Empty;
    [Required, StringLength(100)] public string SerialNumber { get; init; } = string.Empty;
    [EnumDataType(typeof(AssetStatus))] public AssetStatus Status { get; init; }
}
