using Microsoft.EntityFrameworkCore;
using MiPrimeraApi.Data;
using MiPrimeraApi.Models;

namespace MiPrimeraApi.Services;

public class ProductoService : IProductoService
{
    private readonly AppDbContext _context;

    public ProductoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Producto>> ObtenerTodosAsync()
    {
        return await _context.Productos
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Producto?> ObtenerPorIdAsync(int id)
    {
        return await _context.Productos
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Producto> CrearAsync(Producto producto)
    {
        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();

        return producto;
    }

    public async Task<Producto?> ActualizarAsync(
        int id,
        Producto producto)
    {
        var existente = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == id);

        if (existente is null)
            return null;

        existente.Nombre = producto.Nombre;
        existente.Precio = producto.Precio;
        existente.Activo = producto.Activo;

        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == id);

        if (producto is null)
            return false;

        _context.Productos.Remove(producto);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<Producto>> ObtenerActivosCostososAsync()
    {
        return await _context.Productos
            .AsNoTracking()
            .Where(p => p.Activo && p.Precio > 50000m)
            .OrderBy(p => p.Precio)
            .ToListAsync();
    }

    public async Task<List<Producto>> CrearVariosAsync(
    List<Producto> productos)
    {
        await _context.Productos.AddRangeAsync(productos);
        await _context.SaveChangesAsync();

        return productos;
    }
}