using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class addGeneMarkerPannel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_MarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.RenameColumn(
                name: "MarkerPannelId",
                table: "T_LiquidCategories",
                newName: "GeneMarkerPannelId");

            migrationBuilder.RenameIndex(
                name: "IX_T_LiquidCategories_MarkerPannelId",
                table: "T_LiquidCategories",
                newName: "IX_T_LiquidCategories_GeneMarkerPannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories",
                column: "GeneMarkerPannelId",
                principalTable: "T_MarkerPannels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_GeneMarkerPannelId",
                table: "T_LiquidCategories");

            migrationBuilder.RenameColumn(
                name: "GeneMarkerPannelId",
                table: "T_LiquidCategories",
                newName: "MarkerPannelId");

            migrationBuilder.RenameIndex(
                name: "IX_T_LiquidCategories_GeneMarkerPannelId",
                table: "T_LiquidCategories",
                newName: "IX_T_LiquidCategories_MarkerPannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_T_LiquidCategories_T_MarkerPannels_MarkerPannelId",
                table: "T_LiquidCategories",
                column: "MarkerPannelId",
                principalTable: "T_MarkerPannels",
                principalColumn: "Id");
        }
    }
}
