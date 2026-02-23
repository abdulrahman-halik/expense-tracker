import api from './api';
import type { LoginData, RegisterData, AuthResponse, User, UpdateProfileData } from '../types/auth';

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<{ success: boolean; user: User }>('/auth/me');
        return response.data.user;
    },

    updateProfile: async (data: UpdateProfileData): Promise<{ success: boolean; message: string; user: User }> => {
        const response = await api.put<{ success: boolean; message: string; user: User }>('/auth/profile', data);
        return response.data;
    },
};
