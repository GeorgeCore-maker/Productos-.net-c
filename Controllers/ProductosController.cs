using Microsoft.AspNetCore.Mvc;
using MiPrimeraApi.Models;
using MiPrimeraApi.Services;
using MiPrimeraApi.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace MiPrimeraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductosController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductoRespuestaDto>>> ObtenerTodos()
    {
        var productos = await _productoService.ObtenerTodosAsync();

        var respuesta = productos
            .Select(ConvertirARespuesta)
            .ToList();

        return Ok(respuesta);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoRespuestaDto>> ObtenerPorId(int id)
    {
        var producto = await _productoService.ObtenerPorIdAsync(id);

        if (producto is null)
            return NotFound();

        return Ok(ConvertirARespuesta(producto));
    }

    [HttpPost]
    public async Task<ActionResult<ProductoRespuestaDto>> Crear(ProductoCrearDto dto)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Precio = dto.Precio,
            Activo = dto.Activo
        };

        var nuevoProducto = await _productoService.CrearAsync(producto);
        var respuesta = ConvertirARespuesta(nuevoProducto);

        return CreatedAtAction(
            nameof(ObtenerPorId),
            new { id = nuevoProducto.Id },
            respuesta
        );
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductoRespuestaDto>> Actualizar(
        int id,
        ProductoActualizarDto dto)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Precio = dto.Precio,
            Activo = dto.Activo
        };

        var actualizado = await _productoService.ActualizarAsync(id, producto);

        if (actualizado is null)
            return NotFound();

        return Ok(ConvertirARespuesta(actualizado));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var eliminado = await _productoService.EliminarAsync(id);

        if (!eliminado)
            return NotFound();

        return NoContent();
    }

    [HttpGet("activos-costosos")]
    public async Task<ActionResult<List<Producto>>> ObtenerActivosCostosos()
    {
        var productos = await _productoService.ObtenerActivosCostososAsync();
        return Ok(productos);
    }

    [HttpPost("varios")]
    public async Task<ActionResult<List<Producto>>> CrearVarios(
        List<Producto> productos)
    {
        if (productos is null || productos.Count == 0)
            return BadRequest("Debes enviar al menos un producto.");

        var nuevosProductos =
            await _productoService.CrearVariosAsync(productos);

        return Ok(nuevosProductos);
    }


    private static ProductoRespuestaDto ConvertirARespuesta(Producto producto)
    {
        return new ProductoRespuestaDto
        {
            Id = producto.Id,
            Nombre = producto.Nombre,
            Precio = producto.Precio,
            Activo = producto.Activo
        };
    }
}