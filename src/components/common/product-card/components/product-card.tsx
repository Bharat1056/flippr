import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ProductCardProps } from '../types'
import Image from 'next/image'

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  stockPrice,
  thresholdPrice,
  staffName,
  adminName,
  createdAt,
  barcode,
  category,
  className,
}) => {
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

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-lg',
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={`Product ${id}`}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold">
              Product #{id}
            </CardTitle>
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

        {/* Staff and Admin Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              Staff:
            </span>
            <span className="text-sm font-medium">{staffName}</span>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              Admin:
            </span>
            <span className="text-sm font-medium">{adminName}</span>
          </div> */}
        </div>

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
  )
}

export default ProductCard
