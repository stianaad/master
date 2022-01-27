using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sheep",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sheep", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tours",
                columns: table => new
                {
                    IdTour = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Start = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours", x => x.IdTour);
                });

            migrationBuilder.CreateTable(
                name: "SheepPositions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    TimeOfObsevation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SmallBrownSheep = table.Column<int>(type: "int", nullable: false),
                    SmallWhiteSheep = table.Column<int>(type: "int", nullable: false),
                    BigBrownSheep = table.Column<int>(type: "int", nullable: false),
                    BigWhiteSheep = table.Column<int>(type: "int", nullable: false),
                    TotalNumberOfSheep = table.Column<int>(type: "int", nullable: false),
                    TieGreen = table.Column<int>(type: "int", nullable: false),
                    TieRed = table.Column<int>(type: "int", nullable: false),
                    TieYellow = table.Column<int>(type: "int", nullable: false),
                    TieBlue = table.Column<int>(type: "int", nullable: false),
                    IdTour = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SheepPositions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SheepPositions_Tours_IdTour",
                        column: x => x.IdTour,
                        principalTable: "Tours",
                        principalColumn: "IdTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    TimePosition = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdTour = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourLocations_Tours_IdTour",
                        column: x => x.IdTour,
                        principalTable: "Tours",
                        principalColumn: "IdTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SheepPositions_IdTour",
                table: "SheepPositions",
                column: "IdTour");

            migrationBuilder.CreateIndex(
                name: "IX_TourLocations_IdTour",
                table: "TourLocations",
                column: "IdTour");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sheep");

            migrationBuilder.DropTable(
                name: "SheepPositions");

            migrationBuilder.DropTable(
                name: "TourLocations");

            migrationBuilder.DropTable(
                name: "Tours");
        }
    }
}
