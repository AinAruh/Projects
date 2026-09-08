using IndustrialAssets.Application.DTOs; using IndustrialAssets.Application.Interfaces; using Microsoft.AspNetCore.Mvc;
namespace IndustrialAssets.API.Controllers;
[ApiController,Route("api/assets")]
public sealed class AssetsController(IAssetService service):ControllerBase
{
 [HttpGet] public async Task<ActionResult<IReadOnlyList<AssetDto>>> GetAll(CancellationToken ct)=>Ok(await service.GetAllAsync(ct));
 [HttpGet("{id:guid}")] public async Task<ActionResult<AssetDto>> GetById(Guid id,CancellationToken ct){var asset=await service.GetByIdAsync(id,ct);return asset is null?NotFound():Ok(asset);}
 [HttpPost] public async Task<ActionResult<AssetDto>> Create([FromBody] SaveAssetRequest request,CancellationToken ct){var asset=await service.CreateAsync(request,ct);return CreatedAtAction(nameof(GetById),new{id=asset.Id},asset);}
 [HttpPut("{id:guid}")] public async Task<ActionResult<AssetDto>> Update(Guid id,[FromBody] SaveAssetRequest request,CancellationToken ct){var asset=await service.UpdateAsync(id,request,ct);return asset is null?NotFound():Ok(asset);}
 [HttpDelete("{id:guid}")] public async Task<IActionResult> Delete(Guid id,CancellationToken ct)=>await service.DeleteAsync(id,ct)?NoContent():NotFound();
}
