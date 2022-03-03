using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class addPreditorTypeToDeadSheep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PreditorId",
                table: "DeadSheepPositions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreditorId",
                table: "DeadSheepPositions");
        }
    }
}
