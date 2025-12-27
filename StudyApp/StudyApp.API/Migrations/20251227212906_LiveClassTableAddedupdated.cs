using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class LiveClassTableAddedupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MeetingNumber",
                table: "LiveClasses",
                newName: "ZoomMeetingId");

            migrationBuilder.AddColumn<string>(
                name: "JoinUrl",
                table: "LiveClasses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StartUrl",
                table: "LiveClasses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JoinUrl",
                table: "LiveClasses");

            migrationBuilder.DropColumn(
                name: "StartUrl",
                table: "LiveClasses");

            migrationBuilder.RenameColumn(
                name: "ZoomMeetingId",
                table: "LiveClasses",
                newName: "MeetingNumber");
        }
    }
}
