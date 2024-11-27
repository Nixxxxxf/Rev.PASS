using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class addgene : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Count",
                table: "T_Liquids");

            migrationBuilder.DropColumn(
                name: "IsUsed",
                table: "T_Liquids");

            migrationBuilder.AddColumn<float>(
                name: "FAM",
                table: "T_Liquids",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "HEX",
                table: "T_Liquids",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "ROX",
                table: "T_Liquids",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AlleleOfFAM",
                table: "T_LiquidCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AlleleOfHEX",
                table: "T_LiquidCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.AddColumn<string>(
                name: "GeneSequence",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GeneStrand",
                table: "T_LiquidCategories",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MarkerDescription",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MarkerID",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimerList",
                table: "T_LiquidCategories",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FAM",
                table: "T_Liquids");

            migrationBuilder.DropColumn(
                name: "HEX",
                table: "T_Liquids");

            migrationBuilder.DropColumn(
                name: "ROX",
                table: "T_Liquids");

            migrationBuilder.DropColumn(
                name: "AlleleOfFAM",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "AlleleOfHEX",
                table: "T_LiquidCategories");

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
                name: "GeneSequence",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "GeneStrand",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "MarkerDescription",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "MarkerID",
                table: "T_LiquidCategories");

            migrationBuilder.DropColumn(
                name: "PrimerList",
                table: "T_LiquidCategories");

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "T_Liquids",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsUsed",
                table: "T_Liquids",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
