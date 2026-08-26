using IndustrialAssets.Domain.Entities;
namespace IndustrialAssets.Application.Interfaces;
public interface IAssetRepository
{
    Task<IReadOnlyList<Asset>> GetAllAsync(CancellationToken cancellationToken);
    Task<Asset?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> CodeExistsAsync(string code, Guid? excludedId, CancellationToken cancellationToken);
    Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludedId, CancellationToken cancellationToken);
    Task AddAsync(Asset asset, CancellationToken cancellationToken);
    void Remove(Asset asset);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
