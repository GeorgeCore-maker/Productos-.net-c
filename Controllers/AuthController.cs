
using Microsoft.AspNetCore.Mvc;
using MiPrimeraApi.Services;

namespace MiPrimeraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;

    public AuthController(TokenService tokenService)
    {
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Credenciales exclusivamente para practicar en local.
        if (request.Usuario != "admin" ||
            request.Contrasena != "admin123")
        {
            return Unauthorized(new
            {
                mensaje = "Credenciales incorrectas."
            });
        }

        var token = _tokenService.CrearToken(request.Usuario);

        return Ok(new { token });
    }
}

public class LoginRequest
{
    public string Usuario { get; set; } = string.Empty;
    public string Contrasena { get; set; } = string.Empty;
}
