using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KeyFunc.Migrations
{
    /// <inheritdoc />
    public partial class MoreChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "JoinedOn",
                table: "Users",
                type: "datetime(6)",
                nullable: true,
                defaultValue: new DateTime(2023, 12, 23, 16, 53, 45, 722, DateTimeKind.Local).AddTicks(6860),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 11, 21, 15, 41, 52, 945, DateTimeKind.Local).AddTicks(4450));

            migrationBuilder.AddColumn<int>(
                name: "Likes",
                table: "Posts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "createdAt",
                table: "Posts",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 23, 16, 53, 45, 722, DateTimeKind.Local).AddTicks(9720));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Messages",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2023, 12, 23, 16, 53, 45, 723, DateTimeKind.Local).AddTicks(820),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2023, 11, 21, 15, 41, 52, 945, DateTimeKind.Local).AddTicks(7830));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Likes",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "createdAt",
                table: "Posts");

            migrationBuilder.AlterColumn<DateTime>(
                name: "JoinedOn",
                table: "Users",
                type: "datetime(6)",
                nullable: true,
                defaultValue: new DateTime(2023, 11, 21, 15, 41, 52, 945, DateTimeKind.Local).AddTicks(4450),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true,
                oldDefaultValue: new DateTime(2023, 12, 23, 16, 53, 45, 722, DateTimeKind.Local).AddTicks(6860));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Messages",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 21, 15, 41, 52, 945, DateTimeKind.Local).AddTicks(7830),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2023, 12, 23, 16, 53, 45, 723, DateTimeKind.Local).AddTicks(820));
        }
    }
}
