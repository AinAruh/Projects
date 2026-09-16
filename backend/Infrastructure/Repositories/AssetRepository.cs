using IndustrialAssets.Application.Interfaces;
using IndustrialAssets.Domain.Entities;
using IndustrialAssets.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IndustrialAssets.Infrastructure.Repositories;

public sealed class AssetRepository(AssetsDbContext db) : IAssetRepository
{
    public async Task<IReadOnlyList<Asset>> GetAllAsync(CancellationToken ct) =>
        await db.Assets.AsNoTracking().OrderBy(asset => asset.Code).ToListAsync(ct);

    public Task<Asset?> GetByIdAsync(Guid id, CancellationToken ct) =>
        db.Assets.FirstOrDefaultAsync(asset => asset.Id == id, ct);

    public Task<bool> CodeExistsAsync(string code, Guid? excludedId, CancellationToken ct) =>
        db.Assets.AnyAsync(asset => asset.Code.ToLower() == code.ToLower() &&
            (!excludedId.HasValue || asset.Id != excludedId), ct);

    public Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludedId, CancellationToken ct) =>
        db.Assets.AnyAsync(asset => asset.SerialNumber.ToLower() == serialNumber.ToLower() &&
            (!excludedId.HasValue || asset.Id != excludedId), ct);

    public Task AddAsync(Asset asset, CancellationToken ct) => db.Assets.AddAsync(asset, ct).AsTask();

    public void Remove(Asset asset) => db.Assets.Remove(asset);

    public Task SaveChangesAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
}
