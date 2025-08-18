using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagerApi.DTOs;
using TaskManagerApi.Models;
using TaskManagerApi.Services;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ILogger<TasksController> _logger;
        
        public TasksController(ITaskService taskService, ILogger<TasksController> logger)
        {
            _taskService = taskService;
            _logger = logger;
        }
        
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] TaskFilterDto filter)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _taskService.GetTasksAsync(userId, filter);
                
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var task = await _taskService.GetTaskByIdAsync(id, userId);
                
                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada" });
                
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask([FromBody] TaskCreateDto taskCreateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var userId = GetCurrentUserId();
                var task = await _taskService.CreateTaskAsync(taskCreateDto, userId);
                
                
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, [FromBody] TaskUpdateDto taskUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var userId = GetCurrentUserId();
                var task = await _taskService.UpdateTaskAsync(id, taskUpdateDto, userId);
                
                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada" });
                
                
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var success = await _taskService.DeleteTaskAsync(id, userId);
                
                if (!success)
                    return NotFound(new { message = "Tarefa não encontrada" });
                
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByStatus(TaskItemStatus status)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _taskService.GetTasksByStatusAsync(userId, status);
                
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            try
            {
                var userId = GetCurrentUserId();
                var statistics = await _taskService.GetTaskStatisticsAsync(userId);
                
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
        
        [HttpPatch("{id}/complete")]
        public async Task<ActionResult<TaskDto>> CompleteTask(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var taskUpdate = new TaskUpdateDto { Status = TaskItemStatus.Completed };
                var task = await _taskService.UpdateTaskAsync(id, taskUpdate, userId);
                
                if (task == null)
                    return NotFound(new { message = "Tarefa não encontrada" });
                
                
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }
}
