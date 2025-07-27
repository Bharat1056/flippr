import type { Category, CreateCategoryInput } from '@/lib/types/product.types'
import { apiClient } from './axios-config'

export class CategoryService {
  private readonly categoryEndpoint = '/api/v1/category'

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      `${this.categoryEndpoint}/get`
    )
    return response
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post<Category>(
      `${this.categoryEndpoint}/create`,
      data
    )
    return response
  }
}

export const categoryService = new CategoryService()
