using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class addsamplecategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeneCDS",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "GeneDonors",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "GeneFunction",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "GeneLocation",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "GeneStrand",
                table: "T_LiquidCategories");

            migrationBuilder.RenameColumn(
                name: "GeneSequence",
                table: "T_LiquidCategories",
                newName: "SampleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SampleID",
                table: "T_LiquidCategories",
                newName: "GeneSequence");

            migrationBuilder.AddColumn<string>(
                name: "GeneCDS",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GeneDonors",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GeneFunction",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GeneLocation",
                table: "T_LiquidCategories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GeneStrand",
                table: "T_LiquidCategories",
                type: "bit",
                nullable: true);
        }
    }
}
