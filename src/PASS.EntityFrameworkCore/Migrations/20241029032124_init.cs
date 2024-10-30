using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PASS.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_CsvHeaders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CsvName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeaderName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActualValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_CsvHeaders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_Instruments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Component = table.Column<float>(type: "real", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Instruments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_LiquidCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SMILES = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LiquidType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_LiquidCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_Plates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlateType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlateSize = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Plates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_Reports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Reports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_LiquidTransferHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TransferType = table.Column<int>(type: "int", nullable: false),
                    SourceLiquidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DestinationLiquidId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FinalLiquidId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SourcePlateChildId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DestinationPlateChildId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TransferVolume = table.Column<float>(type: "real", nullable: true),
                    InstrumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Result = table.Column<float>(type: "real", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_LiquidTransferHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_LiquidTransferHistories_T_Instruments_InstrumentId",
                        column: x => x.InstrumentId,
                        principalTable: "T_Instruments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_LiquidAttributes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LiquidCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttributeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_LiquidAttributes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_LiquidAttributes_T_LiquidCategories_LiquidCategoryId",
                        column: x => x.LiquidCategoryId,
                        principalTable: "T_LiquidCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_Liquids",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LiquidCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Volume = table.Column<float>(type: "real", nullable: true),
                    Concentration = table.Column<float>(type: "real", nullable: true),
                    Result = table.Column<float>(type: "real", nullable: true),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Liquids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_Liquids_T_LiquidCategories_LiquidCategoryId",
                        column: x => x.LiquidCategoryId,
                        principalTable: "T_LiquidCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_PlateChildren",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Row = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Column = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_PlateChildren", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_PlateChildren_T_Plates_PlateId",
                        column: x => x.PlateId,
                        principalTable: "T_Plates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_PlateTransferHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstrumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Direction = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssayTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    TransferTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_PlateTransferHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_PlateTransferHistories_T_Instruments_InstrumentId",
                        column: x => x.InstrumentId,
                        principalTable: "T_Instruments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_PlateTransferHistories_T_Plates_PlateId",
                        column: x => x.PlateId,
                        principalTable: "T_Plates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_ReportItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateTimePoint = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SourcePlateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SourcePlateBarcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SourcePlateType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SourceWell = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinationPlateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinationPlateBarcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinationPlateType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DestinationWell = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferVolumeNL = table.Column<float>(type: "real", nullable: true),
                    ActualVolumeNL = table.Column<float>(type: "real", nullable: true),
                    SampleID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SampleName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SurveyFluidVolumeUL = table.Column<float>(type: "real", nullable: true),
                    CurrentFluidVolumeUL = table.Column<float>(type: "real", nullable: true),
                    FluidComposition = table.Column<float>(type: "real", nullable: true),
                    FluidUnits = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FluidType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_ReportItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_ReportItems_T_Reports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "T_Reports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_LiquidPositionInPlates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LiquidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlateChildId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_LiquidPositionInPlates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_LiquidPositionInPlates_T_Liquids_LiquidId",
                        column: x => x.LiquidId,
                        principalTable: "T_Liquids",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_LiquidPositionInPlates_T_PlateChildren_PlateChildId",
                        column: x => x.PlateChildId,
                        principalTable: "T_PlateChildren",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_LiquidAttributes_LiquidCategoryId",
                table: "T_LiquidAttributes",
                column: "LiquidCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_T_LiquidPositionInPlates_LiquidId",
                table: "T_LiquidPositionInPlates",
                column: "LiquidId");

            migrationBuilder.CreateIndex(
                name: "IX_T_LiquidPositionInPlates_PlateChildId",
                table: "T_LiquidPositionInPlates",
                column: "PlateChildId");

            migrationBuilder.CreateIndex(
                name: "IX_T_Liquids_LiquidCategoryId",
                table: "T_Liquids",
                column: "LiquidCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_T_LiquidTransferHistories_InstrumentId",
                table: "T_LiquidTransferHistories",
                column: "InstrumentId");

            migrationBuilder.CreateIndex(
                name: "IX_T_PlateChildren_PlateId",
                table: "T_PlateChildren",
                column: "PlateId");

            migrationBuilder.CreateIndex(
                name: "IX_T_PlateTransferHistories_InstrumentId",
                table: "T_PlateTransferHistories",
                column: "InstrumentId");

            migrationBuilder.CreateIndex(
                name: "IX_T_PlateTransferHistories_PlateId",
                table: "T_PlateTransferHistories",
                column: "PlateId");

            migrationBuilder.CreateIndex(
                name: "IX_T_ReportItems_ReportId",
                table: "T_ReportItems",
                column: "ReportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_CsvHeaders");

            migrationBuilder.DropTable(
                name: "T_LiquidAttributes");

            migrationBuilder.DropTable(
                name: "T_LiquidPositionInPlates");

            migrationBuilder.DropTable(
                name: "T_LiquidTransferHistories");

            migrationBuilder.DropTable(
                name: "T_PlateTransferHistories");

            migrationBuilder.DropTable(
                name: "T_ReportItems");

            migrationBuilder.DropTable(
                name: "T_Liquids");

            migrationBuilder.DropTable(
                name: "T_PlateChildren");

            migrationBuilder.DropTable(
                name: "T_Instruments");

            migrationBuilder.DropTable(
                name: "T_Reports");

            migrationBuilder.DropTable(
                name: "T_LiquidCategories");

            migrationBuilder.DropTable(
                name: "T_Plates");
        }
    }
}
