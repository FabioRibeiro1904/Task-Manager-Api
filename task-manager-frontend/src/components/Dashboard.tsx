import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatistics, TaskDto } from '../types';
import apiService from '../services/apiService';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('📊 Dashboard: Loading dashboard data...');
      setIsLoading(true);
      const [statsData, tasksData] = await Promise.all([
        apiService.getTaskStatistics(),
        apiService.getTasks()
      ]);
      console.log('📈 Dashboard: Statistics loaded:', statsData);
      console.log('📋 Dashboard: Tasks loaded:', tasksData);
      setStatistics(statsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('❌ Dashboard: Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: TaskDto) => {
    console.log('✅ Dashboard: New task created:', newTask);
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
    console.log('🔄 Dashboard: Reloading dashboard data...');
    loadDashboardData(); // Reload to update statistics
  };

  const handleTaskUpdated = (updatedTask: TaskDto) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(null);
    setShowTaskForm(false);
    loadDashboardData(); // Reload to update statistics
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    loadDashboardData(); // Reload to update statistics
  };

  const handleEditTask = (task: TaskDto) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue font-mono">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-cyber font-bold neon-text mb-2">
            Bem-vindo, <span className="text-neon-purple">{user?.name}</span>
          </h1>
          <p className="text-gray-400 font-mono">Sistema de Controle de Missões - TaskNexus</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect rounded-xl p-6 hover:border-neon-blue/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-neon-blue font-mono text-sm uppercase tracking-wider">Total</h3>
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
              </div>
              <p className="text-3xl font-cyber font-bold text-white mb-2">{statistics.totalTasks}</p>
              <p className="text-gray-400 text-sm font-mono">Tarefas Criadas</p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover:border-neon-yellow/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-neon-yellow font-mono text-sm uppercase tracking-wider">Pendentes</h3>
                <div className="w-3 h-3 bg-neon-yellow rounded-full animate-pulse"></div>
              </div>
              <p className="text-3xl font-cyber font-bold text-white mb-2">{statistics.pendingTasks}</p>
              <p className="text-gray-400 text-sm font-mono">Aguardando</p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover:border-neon-purple/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-neon-purple font-mono text-sm uppercase tracking-wider">Em Progresso</h3>
                <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse"></div>
              </div>
              <p className="text-3xl font-cyber font-bold text-white mb-2">{statistics.inProgressTasks}</p>
              <p className="text-gray-400 text-sm font-mono">Executando</p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover:border-neon-green/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-neon-green font-mono text-sm uppercase tracking-wider">Completas</h3>
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-3xl font-cyber font-bold text-white mb-2">{statistics.completedTasks}</p>
              <p className="text-gray-400 text-sm font-mono">Finalizadas</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowTaskForm(true);
            }}
            className="cyber-button rounded-lg px-8 py-4 text-lg"
          >
            + NOVA MISSÃO
          </button>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={selectedTask}
            onSubmit={selectedTask ? handleTaskUpdated : handleTaskCreated}
            onCancel={() => {
              setShowTaskForm(false);
              setSelectedTask(null);
            }}
          />
        )}

        {/* Tasks List */}
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-2xl font-cyber font-bold neon-text mb-6">MISSÕES ATIVAS</h2>
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleTaskDeleted}
            onComplete={handleTaskUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
