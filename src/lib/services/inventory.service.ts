import type {
  InventoryLogItem,
  InventoryLogFilters,
} from '@/lib/types/inventory.types'
import { apiClient } from './axios-config'

interface InventoryLogsResponse {
  logs: InventoryLogItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
}

export class InventoryService {
  private readonly endpoint = '/api/v1/inventory'

  async getInventoryLogs(
    filters?: InventoryLogFilters
  ): Promise<InventoryLogsResponse> {
    try {
      const response = await apiClient.get(`${this.endpoint}/logs`, {
        params: filters,
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async getInventoryLogById(id: string): Promise<InventoryLogItem> {
    try {
      const response = await apiClient.get(`${this.endpoint}/logs/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async searchInventoryLogs(query: string): Promise<InventoryLogItem[]> {
    try {
      const response = await apiClient.get(`${this.endpoint}/logs/search`, {
        params: { q: query },
      })
      return response
    } catch (error) {
      throw error
    }
  }
}

export const inventoryService = new InventoryService()
