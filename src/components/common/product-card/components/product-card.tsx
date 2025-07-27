import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Trash2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCardProps } from '../types'
import Image from 'next/image'
import { useDeleteProduct } from '@/lib/hooks/use-products'
import { toast } from 'sonner'

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  currentRole,
  name,
  image,
  stockPrice,
  thresholdPrice,
  staffName,
  createdAt,
  barcode,
  category,
  className,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isPriceAboveThreshold = stockPrice > thresholdPrice

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
          'overflow-hidden transition-all hover:shadow-lg',
          className
        )}
      >
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              image ??
              'https://images.unsplash.com/photo-1750440700610-3e728303b2ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt={`Product ${name}`}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            width={500}
            height={500}
          />
          <div className="absolute inset-0 bg-black/10" />

          {/* Delete Button - Only show for ADMIN role */}
          {currentRole === 'ADMIN' && (
            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {category}
              </Badge>
            </div>
            <Badge
              variant={isPriceAboveThreshold ? 'destructive' : 'secondary'}
              className="ml-2"
            >
              {isPriceAboveThreshold ? 'Above Threshold' : 'Below Threshold'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Stock Price:
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(stockPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Threshold Price:
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {formatPrice(thresholdPrice)}
              </span>
            </div>
          </div>

          {/* Barcode Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Barcode:
              </span>
              <a
                href={barcode}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-32 truncate text-sm font-medium text-blue-600 underline hover:text-blue-800"
                title={barcode}
              >
                View Barcode
              </a>
            </div>
          </div>

          {currentRole === 'ADMIN' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Staff:
                </span>
                <span className="text-sm font-medium">{staffName}</span>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-sm font-medium">
              Created:
            </span>
            <span className="text-muted-foreground text-sm">
              {formatDate(createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductCard
