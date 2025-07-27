import { useQuery } from '@tanstack/react-query'
import { inventoryService } from '@/lib/services/inventory.service'
import type { InventoryLogFilters } from '@/lib/types/inventory.types'

export const useInventoryLogs = (filters?: InventoryLogFilters) => {
  return useQuery({
    queryKey: ['inventoryLogs', filters],
    queryFn: () => inventoryService.getInventoryLogs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useInventoryLog = (id: string) => {
  return useQuery({
    queryKey: ['inventoryLog', id],
    queryFn: () => inventoryService.getInventoryLogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchInventoryLogs = (query: string) => {
  return useQuery({
    queryKey: ['searchInventoryLogs', query],
    queryFn: () => inventoryService.searchInventoryLogs(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// New inventory data hooks
export const useInventoryData = () => {
  return useQuery({
    queryKey: ['inventoryData'],
    queryFn: () => inventoryService.getInventoryData(),
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

export const useInventorySnapshots = (filters?: {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}) => {
  return useQuery({
    queryKey: ['inventorySnapshots', filters],
    queryFn: () => inventoryService.getInventorySnapshots(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useInventorySnapshotByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['inventorySnapshot', productId],
    queryFn: () => inventoryService.getInventorySnapshotByProductId(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
