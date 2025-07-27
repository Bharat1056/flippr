export enum InventoryLogActionType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export interface ProductInfo {
  id: string
  name: string
  categoryName: string
}

export interface AdminInfo {
  id: string
  fullName: string
  username: string
}

export interface StaffInfo {
  id: string
  fullName: string
  username: string
}

export type SortField = 'DATE' | 'NAME' | 'QUANTITY'
export type SortOrder = 'asc' | 'desc'

export interface InventoryLogItem {
  id: string
  note: string
  actionType: InventoryLogActionType
  quantity: string
  createdAt: string
  product: ProductInfo | null
  category: any | null // eslint-disable-line @typescript-eslint/no-explicit-any
  admin: AdminInfo | null
  staff: StaffInfo | null
}

export interface InventoryLogFilters {
  search?: string
  actionType?: InventoryLogActionType
  sortField?: SortField
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

// New inventory data types
export interface InventoryData {
  id: string
  productId: string
  productName: string
  categoryName: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  lastUpdated: string
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCKED'
}

export interface InventorySnapshot {
  id: string
  productId: string
  productName: string
  categoryName: string
  quantity: number
  snapshotDate: string
  previousQuantity?: number
  changeAmount?: number
  changePercentage?: number
}

export interface InventorySnapshotsResponse {
  snapshots: InventorySnapshot[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
}
