using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class addgenetypingandalgorithm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MarkerPannelId",
                table: "T_LiquidCategories",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "T_GeneTypingAlgorithms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_GeneTypingAlgorithms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_MarkerPannels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_MarkerPannels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_GenePlateResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlgorithmID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LiquidID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WellName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MarkerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneMarkerResult = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_GenePlateResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_GenePlateResults_T_GeneTypingAlgorithms_AlgorithmID",
                        column: x => x.AlgorithmID,
                        principalTable: "T_GeneTypingAlgorithms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_T_GenePlateResults_T_Liquids_LiquidID",
                        column: x => x.LiquidID,
                        principalTable: "T_Liquids",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_LiquidCategories_MarkerPannelId",
                table: "T_LiquidCategories",
                column: "MarkerPannelId");

            migrationBuilder.CreateIndex(
                name: "IX_T_GenePlateResults_AlgorithmID",
                table: "T_GenePlateResults",
                column: "AlgorithmID");

            migrationBuilder.CreateIndex(
                name: "IX_T_GenePlateResults_LiquidID",
                table: "T_GenePlateResults",
                column: "LiquidID");

            migrationBuilder.AddForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_MarkerPannelId",
                table: "T_LiquidCategories",
                column: "MarkerPannelId",
                principalTable: "T_MarkerPannels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_MarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.DropTable(
                name: "T_GenePlateResults");

            migrationBuilder.DropTable(
                name: "T_MarkerPannels");

            migrationBuilder.DropTable(
                name: "T_GeneTypingAlgorithms");

            migrationBuilder.DropIndex(
                name: "IX_T_LiquidCategories_MarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "MarkerPannelId",
                table: "T_LiquidCategories");
        }
    }
}
