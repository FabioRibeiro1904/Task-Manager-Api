// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  token: string;
  user: User;
  expiresAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Task Types
export enum TaskItemStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

export interface TaskDto {
  id: number;
  title: string;
  description?: string;
  status: TaskItemStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface TaskCreateDto {
  title: string;
  description?: string;
  status?: TaskItemStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskUpdateDto {
  title?: string;
  description?: string;
  status?: TaskItemStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskFilterDto {
  status?: TaskItemStatus;
  priority?: TaskPriority;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface TaskStatistics {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overduesTasks: number;
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}
