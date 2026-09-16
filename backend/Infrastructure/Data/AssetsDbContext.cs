using IndustrialAssets.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IndustrialAssets.Infrastructure.Data;

public sealed class AssetsDbContext(DbContextOptions<AssetsDbContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets => Set<Asset>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var asset = builder.Entity<Asset>();
        asset.ToTable("assets");
        asset.HasKey(item => item.Id);
        asset.Property(item => item.Id).HasColumnName("id");
        asset.Property(item => item.Code).HasColumnName("code").HasMaxLength(30).IsRequired();
        asset.HasIndex(item => item.Code).IsUnique();
        asset.Property(item => item.Name).HasColumnName("name").HasMaxLength(120).IsRequired();
        asset.Property(item => item.Description).HasColumnName("description").HasMaxLength(500);
        asset.Property(item => item.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(30);
        asset.Property(item => item.Manufacturer).HasColumnName("manufacturer").HasMaxLength(100).IsRequired();
        asset.Property(item => item.Model).HasColumnName("model").HasMaxLength(100).IsRequired();
        asset.Property(item => item.SerialNumber).HasColumnName("serial_number").HasMaxLength(100).IsRequired();
        asset.HasIndex(item => item.SerialNumber).IsUnique();
        asset.Property(item => item.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30);
        asset.Property(item => item.CreatedAt).HasColumnName("created_at").IsRequired();

    }
}
