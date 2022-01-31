using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class AddBlackSheepUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SmallBlackSheeo",
                table: "SheepPositions",
                newName: "SmallBlackSheep");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SmallBlackSheep",
                table: "SheepPositions",
                newName: "SmallBlackSheeo");
        }
    }
}
