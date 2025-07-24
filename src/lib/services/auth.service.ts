import { apiClient } from './axios-config'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '@/lib/types/auth.types'

export class AuthService {
  private readonly endpoint = '/auth'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.endpoint}/login`,
      credentials
    )

    // Store token after successful login
    if (response.token) {
      apiClient.setAuthToken(response.token)
    }

    return response
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.endpoint}/register`,
      credentials
    )

    // Store token after successful registration
    if (response.token) {
      apiClient.setAuthToken(response.token)
    }

    return response
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/logout`)
    } finally {
      // Always remove token, even if logout fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get(`${this.endpoint}/me`)
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.endpoint}/refresh`
    )

    if (response.token) {
      apiClient.setAuthToken(response.token)
    }

    return response
  }

  async forgotPassword(email: string): Promise<void> {
    return apiClient.post(`${this.endpoint}/forgot-password`, { email })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    return apiClient.post(`${this.endpoint}/reset-password`, {
      token,
      password,
    })
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return apiClient.patch(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword,
    })
  }

  async verifyEmail(token: string): Promise<void> {
    return apiClient.post(`${this.endpoint}/verify-email`, { token })
  }

  async resendVerificationEmail(): Promise<void> {
    return apiClient.post(`${this.endpoint}/resend-verification`)
  }
}

export const authService = new AuthService()
