import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDto, RegisterDto, AuthResponseDto } from '../types';
import apiService from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginDto: LoginDto) => Promise<void>;
  register: (registerDto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = apiService.getToken();
        const userData = apiService.getCurrentUser();
        
        if (token && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        apiService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (loginDto: LoginDto): Promise<void> => {
    try {
      console.log('🔐 AuthContext: Starting login process');
      console.log('📝 AuthContext: Login data:', loginDto);
      setIsLoading(true);
      console.log('📡 AuthContext: Calling apiService.login...');
      const response: AuthResponseDto = await apiService.login(loginDto);
      console.log('✅ AuthContext: Login response received:', response);
      setUser(response.user);
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔄 AuthContext: Login process finished');
    }
  };

  const register = async (registerDto: RegisterDto): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponseDto = await apiService.register(registerDto);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
