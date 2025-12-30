using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLectureCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentLectures_Lecturedetails_LecturedetailId",
                table: "StudentLectures");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentLectures_Lecturedetails_LecturedetailId",
                table: "StudentLectures",
                column: "LecturedetailId",
                principalTable: "Lecturedetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentLectures_Lecturedetails_LecturedetailId",
                table: "StudentLectures");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentLectures_Lecturedetails_LecturedetailId",
                table: "StudentLectures",
                column: "LecturedetailId",
                principalTable: "Lecturedetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
