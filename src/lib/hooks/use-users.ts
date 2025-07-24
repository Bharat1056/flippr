import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/lib/services/user.service'
import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from '@/lib/types/user.types'

export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters?: UserFilters) => [...USER_KEYS.lists(), { filters }] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  search: (query: string) => [...USER_KEYS.all, 'search', query] as const,
}

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: USER_KEYS.search(query),
    queryFn: () => userService.searchUsers(query),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
    },
    onError: error => {
      console.error('Failed to create user:', error)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      userService.updateUser(id, data),
    onSuccess: updatedUser => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
      queryClient.setQueryData(USER_KEYS.detail(updatedUser.id), updatedUser)
    },
    onError: error => {
      console.error('Failed to update user:', error)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
      queryClient.removeQueries({ queryKey: USER_KEYS.detail(deletedId) })
    },
    onError: error => {
      console.error('Failed to delete user:', error)
    },
  })
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => userService.bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() })
    },
    onError: error => {
      console.error('Failed to bulk delete users:', error)
    },
  })
}
