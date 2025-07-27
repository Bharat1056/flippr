import { apiClient } from './axios-config'
import type {
  LoginCredentials,
  RegisterAdminCredentials,
  RegisterStaffCredentials,
  AuthResponse,
  User,
} from '@/lib/types/auth.types'

export class AuthService {
  private readonly adminEndpoint = '/api/v1/admin'
  private readonly staffEndpoint = '/api/v1/staff'
  private readonly commonEndpoint = '/api/v1/common'

  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.adminEndpoint}/login`,
      credentials
    )

    // Store token after successful login
    if (response.refreshToken) {
      apiClient.setAuthToken(response.refreshToken)
    }

    return response
  }


  async adminRegister(credentials: RegisterAdminCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.adminEndpoint}/register`,
      credentials
    )
    console.log(response)
    // Store token after successful registration
    if (response.refreshToken) {
      apiClient.setAuthToken(response.refreshToken)
    }

    return response
  }

  async staffRegister(credentials: RegisterStaffCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.staffEndpoint}/register`,
      credentials
    )

    // Store token after successful registration
    if (response.refreshToken) {
      apiClient.setAuthToken(response.refreshToken)
    }

    return response
  }

  async logout(role: string): Promise<void> {
    try {
      await apiClient.post(`${this.commonEndpoint}/logout`, { role })
    } finally {
      // Always remove token, even if logout fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get(`${this.commonEndpoint}/me`)
  }

  // async forgotPassword(email: string): Promise<void> {
  //   return apiClient.post(`${this.commonEndpoint}/forgot-password`, { email })
  // }

  async resetPassword(token: string, password: string): Promise<void> {
    return apiClient.post(`${this.commonEndpoint}/reset-password`, {
      token,
      password,
    })
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return apiClient.patch(`${this.commonEndpoint}/change-password`, {
      currentPassword,
      newPassword,
    })
  }

  async verifyEmail(token: string): Promise<void> {
    return apiClient.post(`${this.commonEndpoint}/verify-email`, { token })
  }

  async resendVerificationEmail(): Promise<void> {
    return apiClient.post(`${this.commonEndpoint}/resend-verification`)
  }
}

export const authService = new AuthService()
