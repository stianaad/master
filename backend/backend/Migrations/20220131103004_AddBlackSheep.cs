using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class AddBlackSheep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BigBlackSheep",
                table: "SheepPositions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SmallBlackSheeo",
                table: "SheepPositions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BigBlackSheep",
                table: "SheepPositions");

            migrationBuilder.DropColumn(
                name: "SmallBlackSheeo",
                table: "SheepPositions");
        }
    }
}
