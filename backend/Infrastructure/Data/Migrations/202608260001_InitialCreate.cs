using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
#nullable disable
namespace IndustrialAssets.Infrastructure.Data.Migrations;
[DbContext(typeof(AssetsDbContext))]
[Migration("202608260001_InitialCreate")]
public partial class InitialCreate : Migration
{
 protected override void Up(MigrationBuilder migrationBuilder){migrationBuilder.CreateTable(name:"assets",columns:table=>new{id=table.Column<Guid>(type:"uuid",nullable:false),code=table.Column<string>(type:"character varying(30)",maxLength:30,nullable:false),name=table.Column<string>(type:"character varying(120)",maxLength:120,nullable:false),description=table.Column<string>(type:"character varying(500)",maxLength:500,nullable:false),type=table.Column<string>(type:"character varying(30)",maxLength:30,nullable:false),manufacturer=table.Column<string>(type:"character varying(100)",maxLength:100,nullable:false),model=table.Column<string>(type:"character varying(100)",maxLength:100,nullable:false),serial_number=table.Column<string>(type:"character varying(100)",maxLength:100,nullable:false),status=table.Column<string>(type:"character varying(30)",maxLength:30,nullable:false),created_at=table.Column<DateTimeOffset>(type:"timestamp with time zone",nullable:false)},constraints:table=>table.PrimaryKey("PK_assets",x=>x.id));migrationBuilder.CreateIndex(name:"IX_assets_code",table:"assets",column:"code",unique:true);migrationBuilder.CreateIndex(name:"IX_assets_serial_number",table:"assets",column:"serial_number",unique:true);}
 protected override void Down(MigrationBuilder migrationBuilder)=>migrationBuilder.DropTable(name:"assets");
}
