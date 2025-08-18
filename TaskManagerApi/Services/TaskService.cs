using Microsoft.EntityFrameworkCore;
using TaskManagerApi.Data;
using TaskManagerApi.DTOs;
using TaskManagerApi.Models;

namespace TaskManagerApi.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterDto filter);
        Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId);
        Task<TaskDto> CreateTaskAsync(TaskCreateDto taskCreateDto, int userId);
        Task<TaskDto?> UpdateTaskAsync(int taskId, TaskUpdateDto taskUpdateDto, int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
        Task<IEnumerable<TaskDto>> GetTasksByStatusAsync(int userId, TaskItemStatus status);
        Task<object> GetTaskStatisticsAsync(int userId);
    }
    
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;
        
        public TaskService(AppDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterDto filter)
        {
            var query = _context.Tasks.Where(t => t.UserId == userId);
            
            if (filter.Status.HasValue)
                query = query.Where(t => t.Status == filter.Status.Value);
            
            if (filter.Priority.HasValue)
                query = query.Where(t => t.Priority == filter.Priority.Value);
            
            if (filter.DueDateFrom.HasValue)
                query = query.Where(t => t.DueDate >= filter.DueDateFrom.Value);
            
            if (filter.DueDateTo.HasValue)
                query = query.Where(t => t.DueDate <= filter.DueDateTo.Value);
            
            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(t => t.Title.Contains(filter.Search) || 
                                       (t.Description != null && t.Description.Contains(filter.Search)));
            
            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    UserId = t.UserId
                })
                .ToListAsync();
            
            return tasks;
        }
        
        public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .Where(t => t.Id == taskId && t.UserId == userId)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    UserId = t.UserId
                })
                .FirstOrDefaultAsync();
            
            return task;
        }
        
        public async Task<TaskDto> CreateTaskAsync(TaskCreateDto taskCreateDto, int userId)
        {
            var task = new TaskItem
            {
                Title = taskCreateDto.Title,
                Description = taskCreateDto.Description,
                Priority = taskCreateDto.Priority,
                DueDate = taskCreateDto.DueDate,
                Status = TaskItemStatus.Pending,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                UserId = task.UserId
            };
        }
        
        public async Task<TaskDto?> UpdateTaskAsync(int taskId, TaskUpdateDto taskUpdateDto, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
            
            if (task == null)
                return null;
            
            if (!string.IsNullOrEmpty(taskUpdateDto.Title))
                task.Title = taskUpdateDto.Title;
            
            if (taskUpdateDto.Description != null)
                task.Description = taskUpdateDto.Description;
            
            if (taskUpdateDto.Status.HasValue)
                task.Status = taskUpdateDto.Status.Value;
            
            if (taskUpdateDto.Priority.HasValue)
                task.Priority = taskUpdateDto.Priority.Value;
            
            if (taskUpdateDto.DueDate.HasValue)
                task.DueDate = taskUpdateDto.DueDate.Value;
            
            task.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                UserId = task.UserId
            };
        }
        
        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
            
            if (task == null)
                return false;
            
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        public async Task<IEnumerable<TaskDto>> GetTasksByStatusAsync(int userId, TaskItemStatus status)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId && t.Status == status)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    UserId = t.UserId
                })
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
            
            return tasks;
        }
        
        public async Task<object> GetTaskStatisticsAsync(int userId)
        {
            var totalTasks = await _context.Tasks.CountAsync(t => t.UserId == userId);
            var completedTasks = await _context.Tasks.CountAsync(t => t.UserId == userId && t.Status == TaskItemStatus.Completed);
            var pendingTasks = await _context.Tasks.CountAsync(t => t.UserId == userId && t.Status == TaskItemStatus.Pending);
            var inProgressTasks = await _context.Tasks.CountAsync(t => t.UserId == userId && t.Status == TaskItemStatus.InProgress);
            
            var overdueTasks = await _context.Tasks.CountAsync(t => 
                t.UserId == userId && 
                t.DueDate.HasValue && 
                t.DueDate < DateTime.UtcNow && 
                t.Status != TaskItemStatus.Completed);
            
            return new
            {
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                PendingTasks = pendingTasks,
                InProgressTasks = inProgressTasks,
                OverdueTasks = overdueTasks,
                CompletionRate = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0
            };
        }
    }
}
