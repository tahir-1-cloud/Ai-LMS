using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class LiveClassTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LiveClasses",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeetingNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    IsStarted = table.Column<bool>(type: "bit", nullable: false),
                    IsEnded = table.Column<bool>(type: "bit", nullable: false),
                    SessionId1 = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiveClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiveClasses_Sessions_SessionId1",
                        column: x => x.SessionId1,
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LiveClasses_SessionId1",
                table: "LiveClasses",
                column: "SessionId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LiveClasses");
        }
    }
}
