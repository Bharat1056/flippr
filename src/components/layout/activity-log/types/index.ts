// components/logs/types/index.ts

export enum InventoryLogActionType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

export interface ProductInfo {
    id: string
    name: string
    code: string
    category: string 
}

export interface AdminInfo {
    id: string
    name: string
    email: string
}

export interface StaffInfo {
    id: string
    name: string
    email: string
}


export type SortField = 'DATE' | 'NAME' | 'QUANTITY'
export type SortOrder = 'asc' | 'desc'

export interface InventoryLogItem {
    id: string
    description: string
    actionType: InventoryLogActionType
    createdAt: string
    quantity: number
    product?: ProductInfo
    admin?: AdminInfo
    staff?: StaffInfo
}
