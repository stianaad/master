using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class addPreditor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreditorId",
                table: "DeadSheepPositions",
                newName: "Preditor");

            migrationBuilder.AddColumn<bool>(
                name: "Dead",
                table: "DeadSheepPositions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dead",
                table: "DeadSheepPositions");

            migrationBuilder.RenameColumn(
                name: "Preditor",
                table: "DeadSheepPositions",
                newName: "PreditorId");
        }
    }
}
