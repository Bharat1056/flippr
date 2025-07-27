'use client'
import React, { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash2, Search, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProducts, useDeleteProduct } from '@/lib/hooks/use-products'
import { useCategories } from '@/lib/hooks/use-categories'
import { useUpdateProductStock } from '@/lib/hooks/use-products'
import { Product, ProductFilters } from '@/lib/types/product.types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/lib/store/hooks'
import { toast } from 'sonner'

// Status calculation function
function getStatus(product: Product): string {
  if (!product.numberOfStocks || product.numberOfStocks < product.threshold)
    return 'Critical'
  if (product.numberOfStocks === product.threshold) return 'Low'
  return 'Good'
}

const ProductList: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAppSelector(state => state.auth)

  // Get current filters from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const debouncedSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || 'all'
  const currentStatus = searchParams.get('status') || 'all'

  // Create filters object
  const filters: ProductFilters = {
    search: debouncedSearch,
    category: currentCategory === 'all' ? undefined : currentCategory,
    page: currentPage,
    limit: 20,
  }

  // Fetch data from backend
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(filters)

  console.log(productsData)

  const { data: categories } = useCategories()

  // Update product stock mutation
  const updateProductStockMutation = useUpdateProductStock()

  // Delete product mutation
  const deleteProductMutation = useDeleteProduct()

  // Local state for stock update dialog
  const [editStockId, setEditStockId] = useState<string | null>(null)
  const [newStockLevel, setNewStockLevel] = useState(0)
  const [note, setNote] = useState('')

  // Local state for delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter products by status
  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return []

    return productsData.products.filter(product => {
      const status = getStatus(product)
      return currentStatus === 'all' || status === currentStatus
    })
  }, [productsData?.products, currentStatus])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
  }

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset to first page
    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/products?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/products?${params.toString()}`)
  }

  const handleUpdateStock = async () => {
    if (editStockId) {
      try {
        await updateProductStockMutation.mutateAsync({
          id: editStockId,
          data: {
            stock: newStockLevel,
            note: note,
          },
        })

        toast.success('Stock updated successfully')
        setEditStockId(null)
        setNote('')
      } catch (error) {
        toast.error('Failed to update stock. Please try again.')
        console.error('Error updating stock:', error)
      }
    }
  }

  // Delete product handlers
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      await deleteProductMutation.mutateAsync(productToDelete.id)
      toast.success('Product deleted successfully')
      setShowDeleteDialog(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setProductToDelete(null)
  }

  // Handle error state
  if (productsError) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm">
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
    )
  }

  return (
    <>
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">
            Product Stock Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                defaultValue={debouncedSearch}
                onChange={e => handleSearchChange(e.target.value)}
                className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={currentCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[160px] border-gray-300 focus:ring-blue-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] border-gray-300 focus:ring-blue-500">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading state */}
          {productsLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="mb-4 h-10 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded bg-gray-200"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-auto rounded-md border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Product
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Stock Level
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Actions
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Quick Edit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 bg-white">
                    {filteredProducts.map(product => {
                      const status = getStatus(product)
                      return (
                        <TableRow
                          key={product.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {product.categoryName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-lg font-bold ${
                                  status === 'Good'
                                    ? 'text-green-600'
                                    : status === 'Low'
                                      ? 'text-amber-600'
                                      : 'text-red-600'
                                }`}
                              >
                                {product.numberOfStocks || 0}
                              </span>
                              <span className="text-sm">
                                {status === 'Good' ? '📈' : '📉'}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              Min: {product.threshold}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === 'Good'
                                  ? 'default'
                                  : status === 'Low'
                                    ? 'outline'
                                    : 'destructive'
                              }
                              className={`${
                                status === 'Good'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : status === 'Low'
                                    ? 'border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog
                              open={editStockId === product.id}
                              onOpenChange={open =>
                                open
                                  ? setEditStockId(product.id)
                                  : setEditStockId(null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setNewStockLevel(
                                      product.numberOfStocks || 0
                                    )
                                    setEditStockId(product.id)
                                  }}
                                  className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500"
                                >
                                  Update Stock
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                  <DialogTitle>Update Stock</DialogTitle>
                                  <p className="text-sm text-gray-600">
                                    {product.name}
                                  </p>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                      <p className="text-sm text-gray-600">
                                        Current
                                      </p>
                                      <p className="text-2xl font-bold text-gray-900">
                                        {product.numberOfStocks || 0}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {getStatus(product)}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm text-gray-600">
                                        New
                                      </p>
                                      <p className="text-2xl font-bold text-gray-900">
                                        {newStockLevel}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {getStatus({
                                          ...product,
                                          numberOfStocks: newStockLevel,
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setNewStockLevel(v =>
                                          Math.max(0, v - 10)
                                        )
                                      }
                                      className="border-gray-300 hover:bg-gray-50"
                                    >
                                      -10
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setNewStockLevel(v =>
                                          Math.max(0, v - 1)
                                        )
                                      }
                                      className="border-gray-300 hover:bg-gray-50"
                                    >
                                      -
                                    </Button>
                                    <Input
                                      type="number"
                                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                      value={newStockLevel}
                                      onChange={e =>
                                        setNewStockLevel(Number(e.target.value))
                                      }
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setNewStockLevel(v => v + 1)
                                      }
                                      className="border-gray-300 hover:bg-gray-50"
                                    >
                                      +
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setNewStockLevel(v => v + 10)
                                      }
                                      className="border-gray-300 hover:bg-gray-50"
                                    >
                                      +10
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[0, 25, 50, 100].map(preset => (
                                      <Button
                                        key={preset}
                                        variant="secondary"
                                        onClick={() => setNewStockLevel(preset)}
                                        className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                                      >
                                        {preset}
                                      </Button>
                                    ))}
                                  </div>
                                  {/* input field to add description */}
                                  <div>
                                    <Input
                                      placeholder="Add a note (optional)"
                                      value={note}
                                      onChange={e => setNote(e.target.value)}
                                      className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      onClick={() => setEditStockId(null)}
                                      className="text-gray-600 hover:text-gray-800"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleUpdateStock}
                                      disabled={
                                        updateProductStockMutation.isPending
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                    >
                                      {updateProductStockMutation.isPending
                                        ? 'Updating...'
                                        : 'Update'}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="space-x-1 text-right">
                            {/* Only show delete button for ADMIN role */}
                            {user?.role === 'ADMIN' && (
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDeleteClick(product)}
                                className="h-8 w-8 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-6 text-center text-gray-500"
                        >
                          No products found matching current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {productsData?.pagination &&
                productsData.pagination.totalPages > 1 && (
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
                        {
                          length: Math.min(
                            5,
                            productsData.pagination.totalPages
                          ),
                        },
                        (_, i) => {
                          const page = i + 1
                          if (productsData.pagination.totalPages <= 5) {
                            return (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? 'default' : 'outline'
                                }
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
                                variant={
                                  currentPage === page ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Button>
                            )
                          }

                          // Show ellipsis
                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <span>Delete Product</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-800">
                &quot;{productToDelete?.name}&quot;
              </span>
              ? This action cannot be undone and will permanently remove the
              product from your inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </div>
              ) : (
                'Delete Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductList
