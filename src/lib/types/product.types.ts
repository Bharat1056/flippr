export interface Product {
  id: string
  name: string
  image: string
  stockPrice: number
  thresholdPrice: number
  staffName: string
  adminName: string
  createdAt: string
  barcode: string
  category: string
  description?: string
  stockQuantity?: number
  sku?: string
  brand?: string
  tags?: string[]
}

export interface CreateProductInput {
  name: string
  image: string
  stockPrice: number
  thresholdPrice: number
  staffName: string
  adminName: string
  barcode: string
  category: string
  description?: string
  stockQuantity?: number
  sku?: string
  brand?: string
  tags?: string[]
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
