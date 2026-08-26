using IndustrialAssets.Application.Interfaces; using IndustrialAssets.Domain.Entities; using IndustrialAssets.Infrastructure.Data; using Microsoft.EntityFrameworkCore;
namespace IndustrialAssets.Infrastructure.Repositories;
public sealed class AssetRepository(AssetsDbContext db):IAssetRepository
{
 public async Task<IReadOnlyList<Asset>> GetAllAsync(CancellationToken ct)=>await db.Assets.AsNoTracking().OrderBy(x=>x.Code).ToListAsync(ct);
 public Task<Asset?> GetByIdAsync(Guid id,CancellationToken ct)=>db.Assets.FirstOrDefaultAsync(x=>x.Id==id,ct);
 public Task<bool> CodeExistsAsync(string code,Guid? excludedId,CancellationToken ct)=>db.Assets.AnyAsync(x=>x.Code.ToLower()==code.ToLower()&&(!excludedId.HasValue||x.Id!=excludedId),ct);
 public Task<bool> SerialNumberExistsAsync(string value,Guid? excludedId,CancellationToken ct)=>db.Assets.AnyAsync(x=>x.SerialNumber.ToLower()==value.ToLower()&&(!excludedId.HasValue||x.Id!=excludedId),ct);
 public Task AddAsync(Asset asset,CancellationToken ct)=>db.Assets.AddAsync(asset,ct).AsTask(); public void Remove(Asset asset)=>db.Assets.Remove(asset); public async Task SaveChangesAsync(CancellationToken ct)=>await db.SaveChangesAsync(ct);
}
