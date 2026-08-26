using IndustrialAssets.Domain.Entities; using Microsoft.EntityFrameworkCore;
namespace IndustrialAssets.Infrastructure.Data;
public sealed class AssetsDbContext(DbContextOptions<AssetsDbContext> options):DbContext(options)
{
 public DbSet<Asset> Assets => Set<Asset>();
 protected override void OnModelCreating(ModelBuilder builder)
 {
  var asset=builder.Entity<Asset>(); asset.ToTable("assets"); asset.HasKey(x=>x.Id); asset.Property(x=>x.Id).HasColumnName("id"); asset.Property(x=>x.Code).HasColumnName("code").HasMaxLength(30).IsRequired(); asset.HasIndex(x=>x.Code).IsUnique(); asset.Property(x=>x.Name).HasColumnName("name").HasMaxLength(120).IsRequired(); asset.Property(x=>x.Description).HasColumnName("description").HasMaxLength(500); asset.Property(x=>x.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(30); asset.Property(x=>x.Manufacturer).HasColumnName("manufacturer").HasMaxLength(100).IsRequired(); asset.Property(x=>x.Model).HasColumnName("model").HasMaxLength(100).IsRequired(); asset.Property(x=>x.SerialNumber).HasColumnName("serial_number").HasMaxLength(100).IsRequired(); asset.HasIndex(x=>x.SerialNumber).IsUnique(); asset.Property(x=>x.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30); asset.Property(x=>x.CreatedAt).HasColumnName("created_at").IsRequired();
 }
}
