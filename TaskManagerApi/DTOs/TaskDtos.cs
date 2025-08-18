using System.ComponentModel.DataAnnotations;
using TaskManagerApi.Models;

namespace TaskManagerApi.DTOs
{
    public class TaskCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public DateTime? DueDate { get; set; }
    }
    
    public class TaskUpdateDto
    {
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public TaskItemStatus? Status { get; set; }
        
        public TaskPriority? Priority { get; set; }
        
        public DateTime? DueDate { get; set; }
    }
    
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskItemStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
    }
    
    public class TaskFilterDto
    {
        public TaskItemStatus? Status { get; set; }
        public TaskPriority? Priority { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
