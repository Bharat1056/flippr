import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/lib/services/category.service'
import type { CreateCategoryInput, Category } from '@/lib/types/product.types'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      try {
        return await categoryService.getCategories()
      } catch (error) {
        // Fallback to dummy data if API fails
        console.log('Using dummy categories due to API error:', error)
        return []
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
