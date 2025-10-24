import { apiClient } from './client'
import type { User, SignUpData, SignInData, AuthResponse } from '../types/auth'

export const authApi = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', {
      email: data.email,
      password: data.password,
    })

    // Store access token if provided
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signin', {
      email: data.email,
      password: data.password,
    })

    // Store access token if provided
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('accessToken')
    }
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/profile')
  },
}
