using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class lecturesassignstd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentLectures_ApplicationUsers_StudentId",
                table: "StudentLectures");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "StudentLectures",
                newName: "SessionId");

            migrationBuilder.RenameIndex(
                name: "IX_StudentLectures_StudentId_LecturedetailId",
                table: "StudentLectures",
                newName: "IX_StudentLectures_SessionId_LecturedetailId");

            migrationBuilder.AddColumn<int>(
                name: "ApplicationUserId",
                table: "StudentLectures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentLectures_ApplicationUserId",
                table: "StudentLectures",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentLectures_ApplicationUsers_ApplicationUserId",
                table: "StudentLectures",
                column: "ApplicationUserId",
                principalTable: "ApplicationUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentLectures_Sessions_SessionId",
                table: "StudentLectures",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentLectures_ApplicationUsers_ApplicationUserId",
                table: "StudentLectures");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentLectures_Sessions_SessionId",
                table: "StudentLectures");

            migrationBuilder.DropIndex(
                name: "IX_StudentLectures_ApplicationUserId",
                table: "StudentLectures");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "StudentLectures");

            migrationBuilder.RenameColumn(
                name: "SessionId",
                table: "StudentLectures",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_StudentLectures_SessionId_LecturedetailId",
                table: "StudentLectures",
                newName: "IX_StudentLectures_StudentId_LecturedetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentLectures_ApplicationUsers_StudentId",
                table: "StudentLectures",
                column: "StudentId",
                principalTable: "ApplicationUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
