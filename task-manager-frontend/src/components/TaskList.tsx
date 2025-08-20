import React from 'react';
import { TaskDto, TaskItemStatus, TaskPriority } from '../types';
import apiService from '../services/apiService';

interface TaskListProps {
  tasks: TaskDto[];
  onEdit: (task: TaskDto) => void;
  onDelete: (taskId: number) => void;
  onComplete: (task: TaskDto) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onComplete }) => {
  const getStatusInfo = (status: TaskItemStatus) => {
    switch (status) {
      case TaskItemStatus.Pending:
        return {
          name: 'PENDENTE',
          color: 'text-neon-yellow border-neon-yellow bg-neon-yellow/10',
          icon: '⏳'
        };
      case TaskItemStatus.InProgress:
        return {
          name: 'PROGRESSO',
          color: 'text-neon-blue border-neon-blue bg-neon-blue/10',
          icon: '🔄'
        };
      case TaskItemStatus.Completed:
        return {
          name: 'CONCLUÍDA',
          color: 'text-neon-green border-neon-green bg-neon-green/10',
          icon: '✅'
        };
      default:
        return {
          name: 'DESCONHECIDO',
          color: 'text-gray-400 border-gray-400 bg-gray-400/10',
          icon: '❓'
        };
    }
  };

  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low:
        return { name: 'BAIXA', color: 'text-blue-400', icon: '⬇️' };
      case TaskPriority.Medium:
        return { name: 'MÉDIA', color: 'text-yellow-400', icon: '➡️' };
      case TaskPriority.High:
        return { name: 'ALTA', color: 'text-orange-400', icon: '⬆️' };
      case TaskPriority.Critical:
        return { name: 'CRÍTICA', color: 'text-red-400', icon: '🔥' };
      default:
        return { name: 'DESCONHECIDA', color: 'text-gray-400', icon: '❓' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCompleteTask = async (task: TaskDto) => {
    try {
      if (task.status !== TaskItemStatus.Completed) {
        const completedTask = await apiService.completeTask(task.id);
        onComplete(completedTask);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta missão?')) {
      try {
        await apiService.deleteTask(taskId);
        onDelete(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-cyber text-gray-400 mb-2">NENHUMA MISSÃO ENCONTRADA</h3>
        <p className="text-gray-500 font-mono">Crie sua primeira missão para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const statusInfo = getStatusInfo(task.status);
        const priorityInfo = getPriorityInfo(task.priority);
        
        return (
          <div key={task.id} className="task-card relative group">
            {/* Task Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-cyber font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-400 font-mono text-sm leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Status and Priority */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${statusInfo.color}`}>
                <span className="mr-2">{statusInfo.icon}</span>
                {statusInfo.name}
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${priorityInfo.color} border-current bg-current/10`}>
                <span className="mr-2">{priorityInfo.icon}</span>
                {priorityInfo.name}
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-gray-400 mb-4">
              <div>
                <span className="text-neon-blue">CRIADA:</span> {formatDate(task.createdAt)}
              </div>
              {task.dueDate && (
                <div>
                  <span className="text-neon-pink">PRAZO:</span> {formatDate(task.dueDate)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={() => onEdit(task)}
                  className="bg-transparent border border-neon-blue/50 text-neon-blue px-4 py-2 
                           font-mono text-xs uppercase tracking-wider transition-all duration-300
                           hover:bg-neon-blue/10 hover:border-neon-blue rounded-lg"
                >
                  EDITAR
                </button>
                
                {task.status !== TaskItemStatus.Completed && (
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="bg-transparent border border-neon-green/50 text-neon-green px-4 py-2 
                             font-mono text-xs uppercase tracking-wider transition-all duration-300
                             hover:bg-neon-green/10 hover:border-neon-green rounded-lg"
                  >
                    CONCLUIR
                  </button>
                )}
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-transparent border border-red-500/50 text-red-400 px-4 py-2 
                           font-mono text-xs uppercase tracking-wider transition-all duration-300
                           hover:bg-red-500/10 hover:border-red-500 rounded-lg"
                >
                  EXCLUIR
                </button>
              </div>
              
              <div className="text-xs font-mono text-gray-500">
                ID: {task.id}
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{
                   background: `linear-gradient(45deg, ${
                     statusInfo.color.includes('yellow') ? 'rgba(255, 255, 0, 0.05)' :
                     statusInfo.color.includes('blue') ? 'rgba(0, 245, 255, 0.05)' :
                     statusInfo.color.includes('green') ? 'rgba(0, 255, 65, 0.05)' :
                     'rgba(191, 0, 255, 0.05)'
                   })`,
                   boxShadow: `0 0 20px ${
                     statusInfo.color.includes('yellow') ? 'rgba(255, 255, 0, 0.1)' :
                     statusInfo.color.includes('blue') ? 'rgba(0, 245, 255, 0.1)' :
                     statusInfo.color.includes('green') ? 'rgba(0, 255, 65, 0.1)' :
                     'rgba(191, 0, 255, 0.1)'
                   }`
                 }}>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
