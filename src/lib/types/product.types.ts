export interface Product {
  id: string
  name: string
  image: string
  staffName: string
  adminName: string
  createdAt: string
  categoryName: string
  description?: string
  numberOfStocks?: number
  status: string
  value: number
  threshold: number
  assignees: [string]
}

export interface CreateProductInput {
  name: string
  description?: string
  category: string
  imageUrl?: string
  numberOfStocks?: number
  value: number
  threshold: number
  staffName: string
  sku?: string
}

export interface UpdateProductInput {
  name?: string
  image?: string
  stockPrice?: number
  thresholdPrice?: number
  staffName?: string
  adminName?: string
  barcode?: string
  category?: string
  description?: string
  stockQuantity?: number
  sku?: string
  brand?: string
  tags?: string[]
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  aboveThreshold?: boolean
  staffName?: string
  adminName?: string
  sortBy?: 'name' | 'stockPrice' | 'thresholdPrice' | 'createdAt' | 'category'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Category types
export enum ProductCategoryType {
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  CLOTHING = 'CLOTHING',
  FOOD = 'FOOD',
  OTHER = 'OTHER',
}

export interface Category {
  id: string
  name: string
  description: string
  type: ProductCategoryType
  createdAt: string
  createdBy: string
}

export interface CreateCategoryInput {
  name: string
  description: string
  type: ProductCategoryType
}
