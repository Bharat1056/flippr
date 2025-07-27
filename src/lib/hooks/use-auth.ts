import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/lib/services/auth.service'
import type {
  LoginCredentials,
  RegisterAdminCredentials,
  RegisterStaffCredentials,
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

export function useAdminLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.adminLogin(credentials),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user(), response.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
    },
    onError: error => {
      console.error('Admin login failed:', error)
    },
  })
}



export function useAdminRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterAdminCredentials) =>
      authService.adminRegister(credentials),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user(), response.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
    },
    onError: error => {
      console.error('Admin registration failed:', error)
    },
  })
}

export function useStaffRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterStaffCredentials) =>
      authService.staffRegister(credentials),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(AUTH_KEYS.user(), response.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
    },
    onError: error => {
      console.error('Staff registration failed:', error)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (role: string) => authService.logout(role),
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(AUTH_KEYS.user(), null)
    },
    onError: error => {
      console.error('Logout failed:', error)
    },
  })
}

// Commented out since forgotPassword is commented in auth.service
// export function useForgotPassword() {
//   return useMutation({
//     mutationFn: (email: string) => authService.forgotPassword(email),
//     onError: error => {
//       console.error('Forgot password failed:', error)
//     },
//   })
// }

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

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onError: error => {
      console.error('Email verification failed:', error)
    },
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
    onError: error => {
      console.error('Resend verification email failed:', error)
    },
  })
}