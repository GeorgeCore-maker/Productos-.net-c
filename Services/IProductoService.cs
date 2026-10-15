using MiPrimeraApi.Models;

namespace MiPrimeraApi.Services;

public interface IProductoService
{
    Task<List<Producto>> ObtenerTodosAsync();
    Task<Producto?> ObtenerPorIdAsync(int id);
    Task<Producto> CrearAsync(Producto producto);
    Task<Producto?> ActualizarAsync(int id, Producto producto);
    Task<bool> EliminarAsync(int id);
    Task<List<Producto>> ObtenerActivosCostososAsync();
    Task<List<Producto>> CrearVariosAsync(
    List<Producto> productos);
}