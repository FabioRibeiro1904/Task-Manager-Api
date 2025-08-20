import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginDto, 
  RegisterDto, 
  AuthResponseDto, 
  TaskDto, 
  TaskCreateDto, 
  TaskUpdateDto, 
  TaskFilterDto, 
  TaskItemStatus, 
  TaskStatistics 
} from '../types';

class ApiService {
  private readonly api: AxiosInstance;
  private readonly baseURL = 'http://localhost:5223/api'; // URL da API .NET

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 ApiService: Request interceptor - outgoing request:', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL,
          data: config.data
        });
        const token = localStorage.getItem('token');
        if (token) {
          console.log('🔑 ApiService: Adding token to request');
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('ℹ️ ApiService: No token found in localStorage');
        }
        return config;
      },
      (error) => {
        console.error('❌ ApiService: Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ ApiService: Response interceptor - incoming response:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('❌ ApiService: Response interceptor error:', error);
        if (error.response?.status === 401) {
          console.log('🔒 ApiService: 401 Unauthorized - logging out');
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    console.log('🌐 ApiService: Starting login request');
    console.log('🔗 ApiService: Base URL:', this.baseURL);
    console.log('📋 ApiService: Login data:', loginDto);
    
    try {
      console.log('📡 ApiService: Making POST request to /Auth/login');
      console.log('🔍 ApiService: Full request details:', {
        url: `${this.baseURL}/Auth/login`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(loginDto)
      });
      
      const response: AxiosResponse<AuthResponseDto> = await this.api.post('/Auth/login', loginDto);
      console.log('✅ ApiService: Login response received:', response);
      console.log('📊 ApiService: Response status:', response.status);
      console.log('💾 ApiService: Response data:', response.data);
      
      if (response.data.token) {
        console.log('🔑 ApiService: Storing token and user data');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ ApiService: Login request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('🔍 ApiService: Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            data: error.config?.data
          }
        });
        
        // Log específico para erro 401
        if (error.response?.status === 401) {
          console.error('🚨 ApiService: 401 UNAUTHORIZED - Credenciais inválidas');
          console.error('📋 ApiService: Request data sent:', error.config?.data);
          console.error('🔒 ApiService: Response from server:', error.response?.data);
        }
      }
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const response: AxiosResponse<AuthResponseDto> = await this.api.post('/Auth/register', registerDto);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async checkHealth(): Promise<any> {
    const response = await this.api.get('/Auth/health');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Task Methods
  async getTasks(filter?: TaskFilterDto): Promise<TaskDto[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response: AxiosResponse<TaskDto[]> = await this.api.get(`/Tasks?${params.toString()}`);
    return response.data;
  }

  async getTaskById(id: number): Promise<TaskDto> {
    const response: AxiosResponse<TaskDto> = await this.api.get(`/Tasks/${id}`);
    return response.data;
  }

  async createTask(taskCreateDto: TaskCreateDto): Promise<TaskDto> {
    const response: AxiosResponse<TaskDto> = await this.api.post('/Tasks', taskCreateDto);
    return response.data;
  }

  async updateTask(id: number, taskUpdateDto: TaskUpdateDto): Promise<TaskDto> {
    const response: AxiosResponse<TaskDto> = await this.api.put(`/Tasks/${id}`, taskUpdateDto);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.api.delete(`/Tasks/${id}`);
  }

  async getTasksByStatus(status: TaskItemStatus): Promise<TaskDto[]> {
    const response: AxiosResponse<TaskDto[]> = await this.api.get(`/Tasks/status/${status}`);
    return response.data;
  }

  async getTaskStatistics(): Promise<TaskStatistics> {
    const response: AxiosResponse<TaskStatistics> = await this.api.get('/Tasks/statistics');
    return response.data;
  }

  async completeTask(id: number): Promise<TaskDto> {
    const response: AxiosResponse<TaskDto> = await this.api.patch(`/Tasks/${id}/complete`);
    return response.data;
  }

  // Utility Methods
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
export default apiService;
