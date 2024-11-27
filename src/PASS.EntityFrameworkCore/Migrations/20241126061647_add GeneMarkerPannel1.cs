using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class addGeneMarkerPannel1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_T_MarkerPannels",
                table: "T_MarkerPannels");

            migrationBuilder.RenameTable(
                name: "T_MarkerPannels",
                newName: "T_GeneMarkerPannels");

            migrationBuilder.AddPrimaryKey(
                name: "PK_T_GeneMarkerPannels",
                table: "T_GeneMarkerPannels",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_T_LiquidCategories_T_GeneMarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories",
                column: "GeneMarkerPannelId",
                principalTable: "T_GeneMarkerPannels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_LiquidCategories_T_GeneMarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_T_GeneMarkerPannels",
                table: "T_GeneMarkerPannels");

            migrationBuilder.RenameTable(
                name: "T_GeneMarkerPannels",
                newName: "T_MarkerPannels");

            migrationBuilder.AddPrimaryKey(
                name: "PK_T_MarkerPannels",
                table: "T_MarkerPannels",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories",
                column: "GeneMarkerPannelId",
                principalTable: "T_MarkerPannels",
                principalColumn: "Id");
        }
    }
}
