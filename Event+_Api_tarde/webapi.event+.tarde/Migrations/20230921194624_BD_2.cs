using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.event_.tarde.Migrations
{
    /// <inheritdoc />
    public partial class BD_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NomeEvento",
                table: "Evento",
                newName: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Evento",
                newName: "NomeEvento");
        }
    }
}
