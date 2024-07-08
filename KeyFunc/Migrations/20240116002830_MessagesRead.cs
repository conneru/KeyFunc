using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KeyFunc.Migrations
{
    /// <inheritdoc />
    public partial class MessagesRead : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReadMessages",
                columns: table => new
                {
                    MessagesReadId = table.Column<int>(type: "int", nullable: false),
                    UsersWhoHaveReadId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadMessages", x => new { x.MessagesReadId, x.UsersWhoHaveReadId });
                    table.ForeignKey(
                        name: "FK_ReadMessages_Messages_MessagesReadId",
                        column: x => x.MessagesReadId,
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadMessages_Users_UsersWhoHaveReadId",
                        column: x => x.UsersWhoHaveReadId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ReadMessages_UsersWhoHaveReadId",
                table: "ReadMessages",
                column: "UsersWhoHaveReadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReadMessages");
        }
    }
}
