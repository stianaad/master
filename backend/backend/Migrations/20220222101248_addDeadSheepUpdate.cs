using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class addDeadSheepUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "size",
                table: "DeadSheepPositions",
                newName: "Size");

            migrationBuilder.RenameColumn(
                name: "color",
                table: "DeadSheepPositions",
                newName: "Color");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Size",
                table: "DeadSheepPositions",
                newName: "size");

            migrationBuilder.RenameColumn(
                name: "Color",
                table: "DeadSheepPositions",
                newName: "color");
        }
    }
}
