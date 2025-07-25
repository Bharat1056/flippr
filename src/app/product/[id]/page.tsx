'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  AlertTriangle,
  User,
  Barcode,
} from 'lucide-react'
import { useProduct, useDeleteProduct } from '@/lib/hooks/use-products'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { data: product, isLoading, error } = useProduct(productId)
  const deleteProduct = useDeleteProduct()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(productId)
        router.push('/dashboard')
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleEdit = () => {
    router.push(`/product/${productId}/edit`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-muted h-8 w-1/4 rounded" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-muted h-96 rounded" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-muted h-4 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h3 className="text-destructive mb-2 text-lg font-semibold">
                Product Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                The product you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPriceAboveThreshold = product.stockPrice > product.thresholdPrice

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
              <Image
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                width={500}
                height={500}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Product ID:
                </span>
                <span className="text-sm font-medium">{product.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Category:
                </span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Status:
                </span>
                <Badge
                  variant={isPriceAboveThreshold ? 'destructive' : 'secondary'}
                >
                  {isPriceAboveThreshold
                    ? 'Above Threshold'
                    : 'Below Threshold'}
                </Badge>
              </div>
              {product.description && (
                <div className="border-t pt-4">
                  <span className="text-muted-foreground mb-2 block text-sm font-medium">
                    Description:
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {product.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Stock Price:
                </span>
                <span
                  className={cn(
                    'text-lg font-bold',
                    isPriceAboveThreshold ? 'text-red-600' : 'text-green-600'
                  )}
                >
                  {formatPrice(product.stockPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Threshold Price:
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatPrice(product.thresholdPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Difference:
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isPriceAboveThreshold ? 'text-red-600' : 'text-green-600'
                  )}
                >
                  {formatPrice(
                    Math.abs(product.stockPrice - product.thresholdPrice)
                  )}
                  {isPriceAboveThreshold ? ' above' : ' below'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Staff:
                </span>
                <span className="text-sm font-medium">{product.staffName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Admin:
                </span>
                <span className="text-sm font-medium">{product.adminName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Created:
                </span>
                <span className="text-muted-foreground text-sm">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                  Barcode:
                </span>
                <a
                  href={product.barcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 underline hover:text-blue-800"
                >
                  <Barcode className="h-3 w-3" />
                  View Barcode
                </a>
              </div>
              {product.stockQuantity !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    Stock Quantity:
                  </span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      product.stockQuantity < 10
                        ? 'text-orange-600'
                        : 'text-green-600'
                    )}
                  >
                    {product.stockQuantity} units
                  </span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    SKU:
                  </span>
                  <span className="text-sm font-medium">{product.sku}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    Brand:
                  </span>
                  <span className="text-sm font-medium">{product.brand}</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="border-t pt-4">
                  <span className="text-muted-foreground mb-2 block text-sm font-medium">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
