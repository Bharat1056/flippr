import type {
  Product,
  CreateProductInput,
  ProductFilters,
  Category,
} from '@/lib/types/product.types'
import type { PaginatedResponse } from '@/lib/types/api.types'
import { apiClient } from './axios-config'

export class ProductService {
  private readonly endpoint = '/api/v1/product'

  async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/get`, {
        params: filters,
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post(`${this.endpoint}/create`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`${this.endpoint}/delete/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get(`${this.endpoint}/individual/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async updateProductStock(id: string, data: { stock: number; note: string }) {
    try {
      const response = await apiClient.put(
        `${this.endpoint}/update-stock/${id}`,
        data
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async updateProduct(
    id: string,
    data: Partial<CreateProductInput>
  ): Promise<Product> {
    try {
      const response = await apiClient.put(
        `${this.endpoint}/update/${id}`,
        data
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get(`${this.endpoint}/search`, {
        params: { q: query },
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get(`${this.endpoint}/categories`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export const productService = new ProductService()
