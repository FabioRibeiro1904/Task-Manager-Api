import React, { useState, useEffect } from 'react';
import { TaskDto, TaskItemStatus, TaskPriority, TaskCreateDto, TaskUpdateDto } from '../types';
import apiService from '../services/apiService';

interface TaskFormProps {
  task?: TaskDto | null;
  onSubmit: (task: TaskDto) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskItemStatus.Pending,
    priority: TaskPriority.Medium,
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'priority' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📝 TaskForm: Submitting task:', { task, formData });
      
      const taskData = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      };

      if (task) {
        // Update existing task
        console.log('✏️ TaskForm: Updating task ID:', task.id);
        const updatedTask = await apiService.updateTask(task.id, taskData);
        console.log('✅ TaskForm: Task updated successfully:', updatedTask);
        onSubmit(updatedTask);
      } else {
        // Create new task
        console.log('🆕 TaskForm: Creating new task');
        const newTask = await apiService.createTask(taskData);
        console.log('✅ TaskForm: Task created successfully:', newTask);
        onSubmit(newTask);
      }
    } catch (error) {
      console.error('❌ TaskForm: Error submitting task:', error);
      // You might want to show an error message to the user here
      alert('Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusName = (status: TaskItemStatus) => {
    switch (status) {
      case TaskItemStatus.Pending:
        return 'Pendente';
      case TaskItemStatus.InProgress:
        return 'Em Progresso';
      case TaskItemStatus.Completed:
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityName = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low:
        return 'Baixa';
      case TaskPriority.Medium:
        return 'Média';
      case TaskPriority.High:
        return 'Alta';
      case TaskPriority.Critical:
        return 'Crítica';
      default:
        return 'Desconhecida';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'PROCESSANDO...';
    return task ? 'ATUALIZAR' : 'CRIAR MISSÃO';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-cyber font-bold neon-text">
              {task ? 'EDITAR MISSÃO' : 'NOVA MISSÃO'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-neon-blue text-sm font-mono mb-2 uppercase tracking-wider">
                Título da Missão
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg"
                placeholder="Digite o título da missão..."
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-neon-blue text-sm font-mono mb-2 uppercase tracking-wider">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="cyber-input w-full rounded-lg resize-none"
                placeholder="Descreva os detalhes da missão..."
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-neon-purple text-sm font-mono mb-2 uppercase tracking-wider">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="cyber-input w-full rounded-lg border-neon-purple/30 focus:border-neon-purple"
                >
                  <option value={TaskItemStatus.Pending}>{getStatusName(TaskItemStatus.Pending)}</option>
                  <option value={TaskItemStatus.InProgress}>{getStatusName(TaskItemStatus.InProgress)}</option>
                  <option value={TaskItemStatus.Completed}>{getStatusName(TaskItemStatus.Completed)}</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-neon-pink text-sm font-mono mb-2 uppercase tracking-wider">
                  Prioridade
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="cyber-input w-full rounded-lg border-neon-pink/30 focus:border-neon-pink"
                >
                  <option value={TaskPriority.Low}>{getPriorityName(TaskPriority.Low)}</option>
                  <option value={TaskPriority.Medium}>{getPriorityName(TaskPriority.Medium)}</option>
                  <option value={TaskPriority.High}>{getPriorityName(TaskPriority.High)}</option>
                  <option value={TaskPriority.Critical}>{getPriorityName(TaskPriority.Critical)}</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-neon-green text-sm font-mono mb-2 uppercase tracking-wider">
                Data Limite
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="cyber-input w-full rounded-lg border-neon-green/30 focus:border-neon-green"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 cyber-button rounded-lg py-4"
              >
                {getButtonText()}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-transparent border-2 border-gray-500 text-gray-400 px-6 py-4 
                         font-cyber font-bold uppercase tracking-wider transition-all duration-300
                         hover:bg-gray-500/10 hover:border-gray-400 hover:text-gray-300 rounded-lg"
              >
                CANCELAR
              </button>
            </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-blue"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-blue"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-purple"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-purple"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
