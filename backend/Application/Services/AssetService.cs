using IndustrialAssets.Application.DTOs;
using IndustrialAssets.Application.Interfaces;
using IndustrialAssets.Domain.Entities;
namespace IndustrialAssets.Application.Services;
public sealed class AssetService(IAssetRepository repository) : IAssetService
{
 public async Task<IReadOnlyList<AssetDto>> GetAllAsync(CancellationToken ct) => (await repository.GetAllAsync(ct)).Select(Map).ToList();
 public async Task<AssetDto?> GetByIdAsync(Guid id, CancellationToken ct) { var asset=await repository.GetByIdAsync(id,ct); return asset is null?null:Map(asset); }
 public async Task<AssetDto> CreateAsync(SaveAssetRequest request, CancellationToken ct)
 {
  await EnsureUniqueAsync(request,null,ct); var asset=new Asset { Id=Guid.NewGuid(), CreatedAt=DateTimeOffset.UtcNow, Code=request.Code.Trim().ToUpperInvariant(), Name=request.Name.Trim(), Description=request.Description.Trim(), Type=request.Type, Manufacturer=request.Manufacturer.Trim(), Model=request.Model.Trim(), SerialNumber=request.SerialNumber.Trim(), Status=request.Status };
  await repository.AddAsync(asset,ct); await repository.SaveChangesAsync(ct); return Map(asset);
 }
 public async Task<AssetDto?> UpdateAsync(Guid id,SaveAssetRequest request,CancellationToken ct)
 {
  var asset=await repository.GetByIdAsync(id,ct); if(asset is null)return null; await EnsureUniqueAsync(request,id,ct); asset.Code=request.Code.Trim().ToUpperInvariant(); asset.Name=request.Name.Trim(); asset.Description=request.Description.Trim(); asset.Type=request.Type; asset.Manufacturer=request.Manufacturer.Trim(); asset.Model=request.Model.Trim(); asset.SerialNumber=request.SerialNumber.Trim(); asset.Status=request.Status; await repository.SaveChangesAsync(ct); return Map(asset);
 }
 public async Task<bool> DeleteAsync(Guid id,CancellationToken ct) { var asset=await repository.GetByIdAsync(id,ct); if(asset is null)return false; repository.Remove(asset); await repository.SaveChangesAsync(ct); return true; }
 private async Task EnsureUniqueAsync(SaveAssetRequest request,Guid? id,CancellationToken ct) { if(await repository.CodeExistsAsync(request.Code.Trim(),id,ct))throw new ConflictException("An asset with this code already exists."); if(await repository.SerialNumberExistsAsync(request.SerialNumber.Trim(),id,ct))throw new ConflictException("An asset with this serial number already exists."); }
 private static AssetDto Map(Asset a)=>new(a.Id,a.Code,a.Name,a.Description,a.Type,a.Manufacturer,a.Model,a.SerialNumber,a.Status,a.CreatedAt);
}
