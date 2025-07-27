import type {
  InventoryLogItem,
  InventoryLogFilters,
  InventoryData,
  InventorySnapshot,
  InventorySnapshotsResponse,
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

  // New inventory data endpoints
  async getInventoryData(): Promise<InventoryData[]> {
    try {
      const response = await apiClient.get(this.endpoint)
      return response
    } catch (error) {
      throw error
    }
  }

  async getInventorySnapshots(filters?: {
    page?: number
    limit?: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<InventorySnapshotsResponse> {
    try {
      const response = await apiClient.get(`${this.endpoint}/snapshots`, {
        params: filters,
      })
      return response
    } catch (error) {
      throw error
    }
  }

  async getInventorySnapshotByProductId(
    productId: string
  ): Promise<InventorySnapshot[]> {
    try {
      const response = await apiClient.get(
        `${this.endpoint}/snapshots/${productId}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}

export const inventoryService = new InventoryService()
