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
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCardProps } from '../types'
import { useDeleteProduct } from '@/lib/hooks/use-products'
import { toast } from 'sonner'
import { StockDataModal } from '@/components/common/modals/components/stock-data-modal'

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
  const [showStockModal, setShowStockModal] = useState(false)
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

  const handleStockAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowStockModal(true)
  }

  return (
    <>
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white via-slate-50/40 to-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl',
          'hover:bg-gradient-to-br hover:from-slate-50/60 hover:via-white hover:to-slate-50/40',
          'transform-gpu border border-slate-200/50 will-change-transform',
          className
        )}
      >
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 via-transparent to-purple-500/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Header with sophisticated gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-5 text-white">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-60" />
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white/3" />

          <div className="relative flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-2 truncate text-xl font-bold text-white drop-shadow-sm">
                {name}
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
                  <Package className="h-4 w-4 text-white" />
                  <Badge
                    variant="secondary"
                    className="border-white/30 bg-transparent text-xs font-medium text-white"
                  >
                    {category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Stock Analytics Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleStockAnalyticsClick}
                className="h-10 w-10 transform border-blue-400/50 bg-blue-500/90 p-0 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-blue-500 hover:shadow-xl"
              >
                <BarChart3 className="h-4 w-4 text-white" />
              </Button>

              {/* Enhanced Delete Button - Only show for ADMIN role */}
              {currentRole === 'ADMIN' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="h-10 w-10 transform bg-red-500/90 p-0 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-red-500 hover:shadow-xl"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          {/* Refined Price Information with consistent neutral palette */}
          <div className="space-y-3">
            {/* Stock Price */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2.5">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700">
                    Stock Price
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {isCritical ? (
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="text-xs text-slate-500">
                      {isCritical ? '+' : ''}
                      {priceDifferencePercentage}% from threshold
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-800">
                {formatPrice(stockPrice)}
              </span>
            </div>

            {/* Threshold */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-2.5">
                  <ChartLine className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Threshold
                </span>
              </div>
              <span className="text-lg font-bold text-indigo-600">
                {threshold}
              </span>
            </div>

            {/* Current Stock */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-violet-100 p-2.5">
                  <Activity className="h-5 w-5 text-violet-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Current Stock
                </span>
              </div>
              <span className="text-lg font-bold text-violet-600">
                {currentStock}
              </span>
            </div>
          </div>

          {/* Enhanced Status Badge with refined colors */}
          <div className="flex justify-center pt-2">
            <Badge
              variant={isCritical ? 'destructive' : 'secondary'}
              className={cn(
                'rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300',
                isCritical
                  ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-orange-100/50'
                  : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 shadow-emerald-100/50'
              )}
            >
              <div className="flex items-center gap-2">
                {isCritical ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {isCritical ? 'Needs Attention' : 'Performing Well'}
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

      {/* Stock Data Modal */}
      <StockDataModal
        open={showStockModal}
        onClose={() => setShowStockModal(false)}
        productId={id}
        productName={name}
        categoryName={category}
      />
    </>
  )
}

export default ProductCard
