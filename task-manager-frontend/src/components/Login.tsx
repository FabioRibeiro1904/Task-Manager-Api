import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginDto } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
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
    console.log('🚀 Login form submitted');
    console.log('📧 Form data:', formData);
    setError('');

    try {
      console.log('🔄 Calling login function...');
      const result = await login(formData);
      console.log('✅ Login successful:', result);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error message:', err.message);
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-effect rounded-2xl p-8 animate-slide-up">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cyber font-bold neon-text mb-2 animate-glow">
              TASK<span className="text-neon-purple">NEXUS</span>
            </h1>
            <p className="text-gray-400 font-mono">SISTEMA DE ACESSO SEGURO</p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mt-4"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-neon-blue text-sm font-mono mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg"
                placeholder="user@taskNexus.io"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-neon-blue text-sm font-mono mb-2 uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="cyber-input w-full rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full rounded-lg py-4 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoading ? 'ACESSANDO...' : 'ENTRAR'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm">
              Não possui acesso?{' '}
              <Link 
                to="/register" 
                className="text-neon-purple hover:text-neon-pink transition-colors duration-300 underline"
              >
                Solicitar Cadastro
              </Link>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-blue"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-blue"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-purple"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-purple"></div>
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

export default Login;
