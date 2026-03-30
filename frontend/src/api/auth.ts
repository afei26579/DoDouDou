import { apiClient } from './client';
import { useAuthStore } from '../stores/authStore';

export interface RegisterData {
  email: string;
  password: string;
  nickname?: string;
  platform?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  user_level: string;
  plan: string;
  platform: string;
  created_at: string;
}

export const authApi = {
  async register(data: RegisterData): Promise<TokenResponse> {
    return apiClient.post<TokenResponse>('/auth/register', data);
  },

  async login(data: LoginData): Promise<TokenResponse> {
    return apiClient.post<TokenResponse>('/auth/login', data);
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return apiClient.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken });
  },

  async getCurrentUser(): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/users/me');
  },

  logout() {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
