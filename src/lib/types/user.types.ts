export interface User {
  id: string
  name: string
  email: string
  age: number
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  age: number
}

export interface UpdateUserInput {
  name?: string
  email?: string
  age?: number
  isActive?: boolean
}

export interface UserFilters {
  search?: string
  minAge?: number
  maxAge?: number
  isActive?: boolean
  sortBy?: 'name' | 'email' | 'age' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
