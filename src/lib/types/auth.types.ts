export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isEmailVerified: boolean
  role: 'ADMIN' | 'STAFF'
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterAdminCredentials {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterStaffCredentials {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  role: string
  adminId: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
