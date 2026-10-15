using System.ComponentModel.DataAnnotations;

namespace MiPrimeraApi.DTOs;

public class ProductoActualizarDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(100, MinimumLength = 2)]
    public string Nombre { get; set; } = string.Empty;

    [Range(0.01, 9999999999999999.99,
    ErrorMessage = "El precio debe ser mayor que cero.")]
    public decimal Precio { get; set; }

    public bool Activo { get; set; } = true;
}