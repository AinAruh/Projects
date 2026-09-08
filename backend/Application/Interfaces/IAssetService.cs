using IndustrialAssets.Application.DTOs;
namespace IndustrialAssets.Application.Interfaces;
public interface IAssetService
{
 Task<IReadOnlyList<AssetDto>> GetAllAsync(CancellationToken cancellationToken);
 Task<AssetDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
 Task<AssetDto> CreateAsync(SaveAssetRequest request, CancellationToken cancellationToken);
 Task<AssetDto?> UpdateAsync(Guid id, SaveAssetRequest request, CancellationToken cancellationToken);
 Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
