using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using IndustrialAssets.Domain.Enums;
namespace IndustrialAssets.Application.DTOs;
public sealed class SaveAssetRequest : IValidatableObject
{
    [Required(ErrorMessage = "Informe o código.")]
    [StringLength(30, MinimumLength = 2, ErrorMessage = "O código deve ter de 2 a 30 caracteres.")]
    public string Code { get; init; } = string.Empty;

    [Required(ErrorMessage = "Informe o nome.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "O nome deve ter de 2 a 120 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
    public string Description { get; init; } = string.Empty;

    [JsonRequired]
    [EnumDataType(typeof(AssetType), ErrorMessage = "Tipo de equipamento inválido.")]
    public AssetType Type { get; init; }

    [Required(ErrorMessage = "Informe o fabricante.")]
    [StringLength(100, ErrorMessage = "O fabricante deve ter no máximo 100 caracteres.")]
    public string Manufacturer { get; init; } = string.Empty;

    [Required(ErrorMessage = "Informe o modelo.")]
    [StringLength(100, ErrorMessage = "O modelo deve ter no máximo 100 caracteres.")]
    public string Model { get; init; } = string.Empty;

    [Required(ErrorMessage = "Informe o número de série.")]
    [StringLength(100, ErrorMessage = "O número de série deve ter no máximo 100 caracteres.")]
    public string SerialNumber { get; init; } = string.Empty;

    [JsonRequired]
    [EnumDataType(typeof(AssetStatus), ErrorMessage = "Status inválido.")]
    public AssetStatus Status { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Code) || Code.Trim().Length < 2)
            yield return new ValidationResult("Informe o código.", [nameof(Code)]);
        if (string.IsNullOrWhiteSpace(Name) || Name.Trim().Length < 2)
            yield return new ValidationResult("Informe o nome.", [nameof(Name)]);
        if (string.IsNullOrWhiteSpace(Manufacturer))
            yield return new ValidationResult("Informe o fabricante.", [nameof(Manufacturer)]);
        if (string.IsNullOrWhiteSpace(Model))
            yield return new ValidationResult("Informe o modelo.", [nameof(Model)]);
        if (string.IsNullOrWhiteSpace(SerialNumber))
            yield return new ValidationResult("Informe o número de série.", [nameof(SerialNumber)]);
    }
}
