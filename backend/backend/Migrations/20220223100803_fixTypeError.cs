 using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class fixTypeError : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TimeOfObsevation",
                table: "DeadSheepPositions",
                newName: "TimeOfObservation");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TimeOfObservation",
                table: "DeadSheepPositions",
                newName: "TimeOfObsevation");
        }
    }
}
