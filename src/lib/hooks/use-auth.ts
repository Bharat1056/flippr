import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/lib/services/auth.service'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/lib/types/auth.types'

export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
}

export function useAuth() {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user(), response.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
    },
    onError: error => {
      console.error('Login failed:', error)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user(), response.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
    },
    onError: error => {
      console.error('Registration failed:', error)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(AUTH_KEYS.user(), null)
    },
    onError: error => {
      console.error('Logout failed:', error)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: error => {
      console.error('Forgot password failed:', error)
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onError: error => {
      console.error('Reset password failed:', error)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => authService.changePassword(currentPassword, newPassword),
    onError: error => {
      console.error('Change password failed:', error)
    },
  })
}
