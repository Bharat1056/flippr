'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Package,
  DollarSign,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useStockSnapshots } from '@/lib/hooks/use-inventory'
import { InventoryAreaChart } from '@/components/common/charts/area-chart'
import { cn } from '@/lib/utils'
import type { StockSnapshot } from '@/lib/types/inventory.types'
import { format, subDays, parseISO } from 'date-fns'

interface StockDataModalProps {
  open: boolean
  onClose: () => void
  productId: string
  productName: string
  categoryName: string
}

type TimeRange = '7d' | '30d' | '90d' | '1y'

const timeRangeOptions = [
  { value: '7d', label: '7 Days', days: 7 },
  { value: '30d', label: '30 Days', days: 30 },
  { value: '90d', label: '90 Days', days: 90 },
  { value: '1y', label: '1 Year', days: 365 },
]

export const StockDataModal: React.FC<StockDataModalProps> = ({
  open,
  onClose,
  productId,
  productName,
  categoryName,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Calculate date range
  const dateFrom = useMemo(() => {
    const range = timeRangeOptions.find(option => option.value === timeRange)
    return subDays(new Date(), range?.days || 30).toISOString()
  }, [timeRange])

  const {
    data: stockData,
    isLoading,
    error,
    refetch,
  } = useStockSnapshots(
    productId,
    {
      dateFrom,
      sortOrder,
      sortField: 'timestamp',
    },
    {
      enabled: open && !!productId,
      refetchInterval: open ? 30000 : undefined, // Refetch every 30 seconds when modal is open
    }
  )

  // Process data for charts and analytics
  const analytics = useMemo(() => {
    if (!stockData?.snapshots || stockData.snapshots.length === 0) {
      return {
        totalSnapshots: 0,
        avgQuantity: 0,
        avgValue: 0,
        quantityTrend: 0,
        valueTrend: 0,
        minQuantity: 0,
        maxQuantity: 0,
        minValue: 0,
        maxValue: 0,
        chartData: [],
      }
    }

    const snapshots = stockData.snapshots
    const totalSnapshots = snapshots.length

    // Calculate averages
    const avgQuantity =
      snapshots.reduce((sum, s) => sum + s.quantity, 0) / totalSnapshots
    const avgValue =
      snapshots.reduce((sum, s) => sum + s.value, 0) / totalSnapshots

    // Calculate trends (comparing first half vs second half)
    const midPoint = Math.floor(totalSnapshots / 2)
    const firstHalf = snapshots.slice(0, midPoint)
    const secondHalf = snapshots.slice(midPoint)

    const firstHalfAvgQty =
      firstHalf.reduce((sum, s) => sum + s.quantity, 0) / firstHalf.length
    const secondHalfAvgQty =
      secondHalf.reduce((sum, s) => sum + s.quantity, 0) / secondHalf.length
    const quantityTrend =
      ((secondHalfAvgQty - firstHalfAvgQty) / firstHalfAvgQty) * 100

    const firstHalfAvgVal =
      firstHalf.reduce((sum, s) => sum + s.value, 0) / firstHalf.length
    const secondHalfAvgVal =
      secondHalf.reduce((sum, s) => sum + s.value, 0) / secondHalf.length
    const valueTrend =
      ((secondHalfAvgVal - firstHalfAvgVal) / firstHalfAvgVal) * 100

    // Min/Max values
    const quantities = snapshots.map(s => s.quantity)
    const values = snapshots.map(s => s.value)

    // Transform data for chart
    const chartData = snapshots.map(snapshot => ({
      id: snapshot.id,
      productId: snapshot.productId,
      productName: snapshot.productName,
      categoryName: snapshot.categoryName,
      quantity: snapshot.quantity,
      value: snapshot.value,
      timestamp: snapshot.timestamp.toString(),
      createdAt: snapshot.createdAt.toString(),
    }))

    return {
      totalSnapshots,
      avgQuantity: Math.round(avgQuantity * 100) / 100,
      avgValue: Math.round(avgValue * 100) / 100,
      quantityTrend: Math.round(quantityTrend * 100) / 100,
      valueTrend: Math.round(valueTrend * 100) / 100,
      minQuantity: Math.min(...quantities),
      maxQuantity: Math.max(...quantities),
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      chartData,
    }
  }, [stockData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-emerald-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[95vh] w-[95vw] max-w-7xl gap-0 p-0">
        <div className="flex h-full flex-col">
          <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Stock Analytics
                </DialogTitle>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="font-medium">
                    {productName}
                  </Badge>
                  <Badge variant="secondary" className="font-medium">
                    {categoryName}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={timeRange}
                  onValueChange={(value: TimeRange) => setTimeRange(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {error ? (
              <Card className="border-destructive flex h-full items-center justify-center">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
                  <h3 className="text-destructive mb-2 text-lg font-semibold">
                    Error Loading Stock Data
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Failed to load stock data. Please try again.
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-full flex-col gap-6">
                {/* Analytics Cards */}
                <div className="grid flex-shrink-0 grid-cols-2 gap-4 lg:grid-cols-4">
                  <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-blue-700">
                        Total Data Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-bold text-blue-900">
                          {formatNumber(analytics.totalSnapshots)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-emerald-700">
                        Avg Quantity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-emerald-600" />
                          <span className="text-lg font-bold text-emerald-900">
                            {formatNumber(analytics.avgQuantity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(analytics.quantityTrend)}
                          <span
                            className={cn(
                              'text-xs font-medium',
                              getTrendColor(analytics.quantityTrend)
                            )}
                          >
                            {Math.abs(analytics.quantityTrend)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-purple-700">
                        Avg Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                          <span className="text-lg font-bold text-purple-900">
                            {formatCurrency(analytics.avgValue)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(analytics.valueTrend)}
                          <span
                            className={cn(
                              'text-xs font-medium',
                              getTrendColor(analytics.valueTrend)
                            )}
                          >
                            {Math.abs(analytics.valueTrend)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium text-orange-700">
                        Range Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-600">Qty:</span>
                          <span className="font-medium text-orange-900">
                            {analytics.minQuantity} - {analytics.maxQuantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-600">Value:</span>
                          <span className="font-medium text-orange-900">
                            ${analytics.minValue} - ${analytics.maxValue}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart Section */}
                <div className="min-h-0 flex-1">
                  <Card className="flex h-full flex-col">
                    <CardHeader className="flex-shrink-0 pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5" />
                        Stock Quantity Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-0 flex-1 p-4">
                      <div className="h-full min-h-[400px] w-full overflow-hidden">
                        <InventoryAreaChart
                          data={analytics.chartData}
                          isLoading={isLoading}
                          height={400}
                          showGrid={true}
                          showTooltip={true}
                          color="hsl(var(--primary))"
                          title=""
                          className="!h-full !w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StockDataModal
