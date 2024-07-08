using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KeyFunc.Migrations
{
    /// <inheritdoc />
    public partial class ChatType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Chats",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Chats",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Chats");
        }
    }
}
