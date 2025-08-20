import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // O redirect será feito automaticamente pelo AuthContext
    window.location.href = '/login';
  };

  return (
    <nav className="glass-effect border-b border-neon-blue/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-cyber font-bold neon-text">
              TASK<span className="text-neon-purple">NEXUS</span>
            </h1>
            <div className="ml-4 text-neon-blue font-mono text-sm">
              v2.0 | Sistema de Gerenciamento
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-neon-blue font-mono text-sm uppercase tracking-wider">
                {user?.name}
              </p>
              <p className="text-gray-400 text-xs font-mono">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-red-500/50 text-red-400 px-4 py-2 
                       font-mono text-sm uppercase tracking-wider transition-all duration-300
                       hover:bg-red-500/10 hover:border-red-500 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
