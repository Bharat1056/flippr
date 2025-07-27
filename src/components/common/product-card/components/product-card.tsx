import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Trash2,
  AlertTriangle,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  ChartLine,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCardProps } from '../types'
import { useDeleteProduct } from '@/lib/hooks/use-products'
import { toast } from 'sonner'

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  currentRole,
  name,
  stockPrice,
  threshold,
  currentStock,
  category,
  className,
  status,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteProductMutation = useDeleteProduct()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const priceDifference = stockPrice - threshold
  const priceDifferencePercentage = (
    (priceDifference / threshold) *
    100
  ).toFixed(1)
  const isCritical = status === 'CRITICAL'

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setIsDeleting(true)
      await deleteProductMutation.mutateAsync(id)
      toast.success('Product deleted successfully')
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50/30 to-white shadow-lg backdrop-blur-sm transition-all duration-100 hover:-translate-y-1 hover:shadow-2xl',
          'hover:bg-gradient-to-br hover:from-blue-50/50 hover:via-white hover:to-purple-50/50',
          'transform-gpu will-change-transform',
          className
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Header with enhanced gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 p-5 text-white">
          {/* Animated background pattern */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-2 truncate text-xl font-bold text-white drop-shadow-sm">
                {name}
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <Package className="h-4 w-4 text-white" />
                  <Badge
                    variant="secondary"
                    className="border-white/50 bg-transparent text-xs font-medium text-white"
                  >
                    {category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced Delete Button - Only show for ADMIN role */}
            {currentRole === 'ADMIN' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="h-10 w-10 transform bg-red-500 p-0 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-red-600 hover:shadow-xl"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          {/* Enhanced Price Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Stock Price
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {isCritical ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {isCritical ? '+' : ''}
                      {priceDifferencePercentage}% from threshold
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">
                {formatPrice(stockPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <ChartLine className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Threshold
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {threshold}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Current Stock
                </span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {currentStock}
              </span>
            </div>
          </div>

          {/* Enhanced Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={isCritical ? 'destructive' : 'secondary'}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300',
                isCritical
                  ? 'border-red-300 bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-red-100'
                  : 'border-green-300 bg-gradient-to-r from-green-100 to-emerald-200 text-green-700 shadow-green-100'
              )}
            >
              <div className="flex items-center gap-2">
                {isCritical ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {isCritical ? 'Critical Status' : 'Good Status'}
              </div>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Delete Confirmation Dialog */}
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
                &quot;{name}&quot;
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

export default ProductCard
