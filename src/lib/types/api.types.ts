export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
  timestamp: string
  path: string
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}
