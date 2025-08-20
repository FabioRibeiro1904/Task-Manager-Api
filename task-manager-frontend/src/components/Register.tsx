import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterDto } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
        <div className="absolute top-10 left-10 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-effect rounded-2xl p-8 animate-slide-up">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cyber font-bold neon-text mb-2 animate-glow">
              TASK<span className="text-neon-purple">NEXUS</span>
            </h1>
            <p className="text-gray-400 font-mono">NOVO USUÁRIO</p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-neon-purple to-neon-pink mx-auto mt-4"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-neon-purple text-sm font-mono mb-2 uppercase tracking-wider">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg border-neon-purple/30 focus:border-neon-purple"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-neon-purple text-sm font-mono mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg border-neon-purple/30 focus:border-neon-purple"
                placeholder="user@taskNexus.io"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-neon-purple text-sm font-mono mb-2 uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg border-neon-purple/30 focus:border-neon-purple"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-neon-purple text-sm font-mono mb-2 uppercase tracking-wider">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg border-neon-purple/30 focus:border-neon-purple"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-transparent border-2 border-neon-purple text-neon-purple px-6 py-4 
                       font-cyber font-bold uppercase tracking-wider transition-all duration-300
                       hover:bg-neon-purple hover:text-dark-900 hover:shadow-lg hover:shadow-glow-purple
                       rounded-lg relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm">
              Já possui uma conta?{' '}
              <Link 
                to="/login" 
                className="text-neon-blue hover:text-neon-purple transition-colors duration-300 underline"
              >
                Fazer Login
              </Link>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-purple"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-purple"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-pink"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-pink"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-mono text-xs">
            TaskNexus v2.0 - Sistema Futurista de Gerenciamento
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
