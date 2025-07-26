export interface AddProductProps {
  debouncedSearch: string
  currentCategory: string
}
export interface ProductFormData {
  productId: string
  name: string
  category: string
  status: string
  description?: string
  stockPrice: string
  thresholdPrice: string
  staff: string
  admin: string
  createdAt: string
  barcode: string
  stockQuantity: string
  sku: string
  brand: string
  tags: string[]
}
