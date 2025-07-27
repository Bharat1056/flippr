'use client'

import { useProducts } from '@/lib/hooks/use-products'
import { Badge } from '@/components/ui/badge'
import { ProductLoading } from './product-loading'
import { ProductCard } from '@/components/common/product-card'
import { Button } from '@/components/ui/button'
import { AddProduct } from './add-product'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { Product, ProductFilters } from '@/lib/types/product.types'
import { useAppSelector } from '@/lib/store/hooks'

interface ProductDashboardListProps {
  filters?: ProductFilters
}

export const ProductList = ({ filters }: ProductDashboardListProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAppSelector(state => state.auth)

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const debouncedSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || 'all'

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(filters)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/dashboard?${params.toString()}`)
  }

  // Handle error state
  if (productsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Products</h2>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h3 className="text-destructive mb-2 text-lg font-semibold">
                Error Loading Products
              </h3>
              <p className="text-muted-foreground">
                Failed to load products. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Products</h2>
          {productsData && (
            <div className="flex flex-col gap-1">
              <Badge variant="outline">
                {productsData?.pagination?.total}{' '}
                {productsData?.pagination?.total === 1 ? 'product' : 'products'}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {productsLoading ? (
        <ProductLoading />
      ) : productsData && productsData?.products?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData?.products?.map((product: Product) => (
              <div
                key={product.id}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <ProductCard
                  id={product.id}
                  currentStock={product.numberOfStocks ?? 0}
                  name={product.name}
                  stockPrice={product.value}
                  threshold={product.threshold}
                  currentRole={user?.role as string}
                  createdAt={product.createdAt}
                  category={product.category?.name}
                  status={product.status}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {productsData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!productsData.pagination.hasPrevPage}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, productsData.pagination.totalPages) },
                  (_, i) => {
                    const page = i + 1
                    if (productsData.pagination.totalPages <= 5) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    }

                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === productsData.pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    }

                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      )
                    }

                    return null
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!productsData.pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <AddProduct
          debouncedSearch={debouncedSearch}
          currentCategory={currentCategory}
        />
      )}
    </div>
  )
}
