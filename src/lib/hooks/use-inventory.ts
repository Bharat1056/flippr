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
