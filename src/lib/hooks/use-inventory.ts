import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { inventoryService } from '@/lib/services/inventory.service'
import type {
  InventoryLogItem,
  InventoryLogFilters,
  InventoryData,
  InventorySnapshotsResponse,
  StockSnapshotsResponse,
} from '@/lib/types/inventory.types'

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

export const useInventoryLogs = (
  filters?: InventoryLogFilters
): UseQueryResult<InventoryLogsResponse, Error> => {
  return useQuery({
    queryKey: ['inventory-logs', filters],
    queryFn: () => inventoryService.getInventoryLogs(filters),
  })
}

export const useInventoryLogById = (
  id: string
): UseQueryResult<InventoryLogItem, Error> => {
  return useQuery({
    queryKey: ['inventory-log', id],
    queryFn: () => inventoryService.getInventoryLogById(id),
    enabled: !!id,
  })
}

export const useInventoryData = (): UseQueryResult<InventoryData[], Error> => {
  return useQuery({
    queryKey: ['inventory-data'],
    queryFn: () => inventoryService.getInventoryData(),
  })
}

export const useInventorySnapshots = (filters?: {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}): UseQueryResult<InventorySnapshotsResponse, Error> => {
  return useQuery({
    queryKey: ['inventory-snapshots', filters],
    queryFn: () => inventoryService.getInventorySnapshots(filters),
  })
}

// New hook for stock snapshots by product ID
export const useStockSnapshots = (
  productId: string,
  filters?: {
    page?: number
    limit?: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
    dateFrom?: string
    dateTo?: string
  },
  options?: {
    enabled?: boolean
    refetchInterval?: number
  }
) => {
  return useQuery({
    queryKey: ['stock-snapshots', productId, filters],
    queryFn: () =>
      inventoryService.getStockSnapshotsByProductId(productId, filters),
    enabled: !!productId && options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
