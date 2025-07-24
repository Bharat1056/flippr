import { apiClient } from './axios-config'
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from '@/lib/types/user.types'

export class UserService {
  private readonly endpoint = '/users'

  async getUsers(filters?: UserFilters): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    return apiClient.get(this.endpoint, { params: filters })
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get(`${this.endpoint}/${id}`)
  }

  async createUser(data: CreateUserInput): Promise<User> {
    return apiClient.post(this.endpoint, data)
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return apiClient.patch(`${this.endpoint}/${id}`, data)
  }

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`)
  }

  async searchUsers(query: string): Promise<User[]> {
    return apiClient.get(`${this.endpoint}/search`, { params: { q: query } })
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    return apiClient.delete(`${this.endpoint}/bulk`, { data: { ids } })
  }
}

export const userService = new UserService()
