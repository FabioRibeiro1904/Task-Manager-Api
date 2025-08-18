using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.DTOs;
using TaskManagerApi.Services;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var result = await _authService.LoginAsync(loginDto);
                
                if (result == null)
                    return Unauthorized(new { message = "Email ou senha inválidos" });
                
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var result = await _authService.RegisterAsync(registerDto);
                
                if (result == null)
                    return Conflict(new { message = "Usuário já existe com este email" });
                
                
                return CreatedAtAction(nameof(Register), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                message = "Task Manager API está funcionando", 
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }
    }
}
