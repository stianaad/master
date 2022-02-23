using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations.Sheep
{
    public partial class addDeadSheep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeadSheepPositions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    TimeOfObsevation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    size = table.Column<int>(type: "int", nullable: false),
                    color = table.Column<int>(type: "int", nullable: false),
                    IdTour = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeadSheepPositions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeadSheepPositions_Tours_IdTour",
                        column: x => x.IdTour,
                        principalTable: "Tours",
                        principalColumn: "IdTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeadSheepPositions_IdTour",
                table: "DeadSheepPositions",
                column: "IdTour");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeadSheepPositions");
        }
    }
}
