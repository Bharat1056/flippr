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
