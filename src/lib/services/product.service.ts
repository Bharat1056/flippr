import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from '@/lib/types/product.types'
import type { PaginatedResponse } from '@/lib/types/api.types'

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    stockPrice: 999.99,
    thresholdPrice: 899.99,
    staffName: 'John Smith',
    adminName: 'Sarah Johnson',
    createdAt: '2024-01-15T10:30:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=1234567890123',
    category: 'Electronics',
    description: 'Latest iPhone model with advanced features',
    stockQuantity: 25,
    sku: 'IPH15PRO-001',
    brand: 'Apple',
    tags: ['smartphone', '5G', 'camera'],
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    stockPrice: 1299.99,
    thresholdPrice: 1199.99,
    staffName: 'Mike Wilson',
    adminName: 'Sarah Johnson',
    createdAt: '2024-01-14T14:20:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=9876543210987',
    category: 'Electronics',
    description: 'Lightweight laptop with M2 chip',
    stockQuantity: 15,
    sku: 'MBA-M2-001',
    brand: 'Apple',
    tags: ['laptop', 'ultrabook', 'm2'],
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    stockPrice: 899.99,
    thresholdPrice: 799.99,
    staffName: 'Emily Davis',
    adminName: 'David Brown',
    createdAt: '2024-01-13T09:15:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=4567890123456',
    category: 'Electronics',
    description: 'Android flagship smartphone',
    stockQuantity: 30,
    sku: 'SGS24-001',
    brand: 'Samsung',
    tags: ['smartphone', 'android', '5G'],
  },
  {
    id: '4',
    name: 'Nike Air Max 270',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stockPrice: 129.99,
    thresholdPrice: 99.99,
    staffName: 'Lisa Chen',
    adminName: 'Sarah Johnson',
    createdAt: '2024-01-12T16:45:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=7890123456789',
    category: 'Footwear',
    description: 'Comfortable running shoes',
    stockQuantity: 50,
    sku: 'NAM270-001',
    brand: 'Nike',
    tags: ['running', 'athletic', 'comfortable'],
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stockPrice: 349.99,
    thresholdPrice: 299.99,
    staffName: 'Alex Thompson',
    adminName: 'David Brown',
    createdAt: '2024-01-11T11:30:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=3210987654321',
    category: 'Electronics',
    description: 'Premium noise-cancelling headphones',
    stockQuantity: 20,
    sku: 'SWH1000XM5-001',
    brand: 'Sony',
    tags: ['headphones', 'noise-cancelling', 'bluetooth'],
  },
  {
    id: '6',
    name: 'Adidas Ultraboost 22',
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
    stockPrice: 179.99,
    thresholdPrice: 149.99,
    staffName: 'Chris Rodriguez',
    adminName: 'Sarah Johnson',
    createdAt: '2024-01-10T13:20:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=6543210987654',
    category: 'Footwear',
    description: 'High-performance running shoes',
    stockQuantity: 35,
    sku: 'AUB22-001',
    brand: 'Adidas',
    tags: ['running', 'performance', 'boost'],
  },
  {
    id: '7',
    name: 'Canon EOS R6',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    stockPrice: 2499.99,
    thresholdPrice: 2299.99,
    staffName: 'Rachel Green',
    adminName: 'David Brown',
    createdAt: '2024-01-09T15:10:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=1357924680135',
    category: 'Electronics',
    description: 'Professional mirrorless camera',
    stockQuantity: 8,
    sku: 'CER6-001',
    brand: 'Canon',
    tags: ['camera', 'mirrorless', 'professional'],
  },
  {
    id: '8',
    name: 'Under Armour HOVR',
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
    stockPrice: 119.99,
    thresholdPrice: 89.99,
    staffName: 'Tom Anderson',
    adminName: 'Sarah Johnson',
    createdAt: '2024-01-08T10:45:00Z',
    barcode: 'https://barcode.tec-it.com/barcode.ashx?data=2468135790246',
    category: 'Footwear',
    description: 'Comfortable training shoes',
    stockQuantity: 40,
    sku: 'UAHOVR-001',
    brand: 'Under Armour',
    tags: ['training', 'athletic', 'comfortable'],
  },
]

const mockCategories = [
  'Electronics',
  'Footwear',
  'Clothing',
  'Accessories',
  'Home & Garden',
]

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to filter and paginate products
const filterAndPaginateProducts = (
  products: Product[],
  filters?: ProductFilters
): PaginatedResponse<Product> => {
  let filteredProducts = [...products]

  // Apply search filter
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    )
  }

  // Apply category filter
  if (filters?.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category === filters.category
    )
  }

  // Apply price filters
  if (filters?.minPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.stockPrice >= filters.minPrice!
    )
  }

  if (filters?.maxPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.stockPrice <= filters.maxPrice!
    )
  }

  // Apply threshold filter
  if (filters?.aboveThreshold !== undefined) {
    filteredProducts = filteredProducts.filter(product =>
      filters.aboveThreshold
        ? product.stockPrice > product.thresholdPrice
        : product.stockPrice <= product.thresholdPrice
    )
  }

  // Apply sorting
  if (filters?.sortBy) {
    filteredProducts.sort((a, b) => {
      let aValue: any = a[filters.sortBy!] // eslint-disable-line @typescript-eslint/no-explicit-any
      let bValue: any = b[filters.sortBy!] // eslint-disable-line @typescript-eslint/no-explicit-any

      if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // Apply pagination
  const page = filters?.page || 1
  const limit = filters?.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    data: paginatedProducts,
    total: filteredProducts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProducts.length / limit),
    hasNextPage: endIndex < filteredProducts.length,
    hasPrevPage: page > 1,
  }
}

export class ProductService {
  private readonly endpoint = '/products'

  async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    await delay(2000) // 2 second delay
    return filterAndPaginateProducts(mockProducts, filters)
  }

  async getProductById(id: string): Promise<Product> {
    await delay(2000) // 2 second delay
    const product = mockProducts.find(p => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return product
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    await delay(2000) // 2 second delay
    const newProduct: Product = {
      id: (mockProducts.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      stockQuantity: data.stockQuantity || 0,
      sku: data.sku || `SKU-${Date.now()}`,
      brand: data.brand || 'Unknown',
      tags: data.tags || [],
    }
    mockProducts.push(newProduct)
    return newProduct
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    await delay(2000) // 2 second delay
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    mockProducts[index] = { ...mockProducts[index], ...data }
    return mockProducts[index]
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(2000) // 2 second delay
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    mockProducts.splice(index, 1)
  }

  async searchProducts(query: string): Promise<Product[]> {
    await delay(2000) // 2 second delay
    const searchTerm = query.toLowerCase()
    return mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    )
  }

  async getCategories(): Promise<string[]> {
    await delay(2000) // 2 second delay
    return mockCategories
  }

  async bulkDeleteProducts(ids: string[]): Promise<void> {
    await delay(2000) // 2 second delay
    ids.forEach(id => {
      const index = mockProducts.findIndex(p => p.id === id)
      if (index !== -1) {
        mockProducts.splice(index, 1)
      }
    })
  }

  async getProductStats(): Promise<{
    totalProducts: number
    totalValue: number
    lowStockCount: number
    aboveThresholdCount: number
  }> {
    await delay(2000) // 2 second delay
    const totalProducts = mockProducts.length
    const totalValue = mockProducts.reduce(
      (sum, product) => sum + product.stockPrice,
      0
    )
    const lowStockCount = mockProducts.filter(
      product => (product.stockQuantity || 0) < 10
    ).length
    const aboveThresholdCount = mockProducts.filter(
      product => product.stockPrice > product.thresholdPrice
    ).length

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      aboveThresholdCount,
    }
  }
}

export const productService = new ProductService()
