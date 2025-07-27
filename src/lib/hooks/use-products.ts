import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/lib/services/product.service'
import type {
  CreateProductInput,
  ProductFilters,
  UpdateProductInput,
} from '@/lib/types/product.types'

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      productService.createProduct(data),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // Invalidate product stats if they exist
      queryClient.invalidateQueries({ queryKey: ['productStats'] })
    },
    onError: error => {
      console.error('Error creating product:', error)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific product
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () => productService.searchProducts(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { stock: number; note: string }
    }) => productService.updateProductStock(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: error => {
      console.error('Error updating product stock:', error)
    },
  })
}
