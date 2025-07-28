'use client'

import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

// Type definitions
export interface InventoryChartData {
  id: string
  productId: string
  productName: string
  categoryName: string
  quantity: number
  value: number
  timestamp: string
  createdAt: string
}

export interface ProcessedChartData {
  date: string
  quantity: number
  formattedDate: string
  productName?: string
  categoryName?: string
}

export interface InventoryAreaChartProps {
  data?: InventoryChartData[]
  isLoading?: boolean
  className?: string
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  gradientId?: string
  color?: string
  title?: string
}

// Default dummy data for demonstration
const generateDummyData = (): InventoryChartData[] => {
  const baseDate = new Date()
  const products = [
    { name: 'Laptop', category: 'Electronics' },
    { name: 'Monitor', category: 'Electronics' },
    { name: 'Keyboard', category: 'Accessories' },
    { name: 'Mouse', category: 'Accessories' },
  ]

  return Array.from({ length: 30 }, (_, index) => {
    const date = subDays(baseDate, 29 - index)
    const product = products[Math.floor(Math.random() * products.length)]
    const baseQuantity = 100
    const variation = Math.floor(Math.random() * 40) - 20 // -20 to +20
    const quantity = Math.max(
      0,
      baseQuantity + variation + Math.sin(index * 0.3) * 15
    )

    return {
      id: `dummy-${index}`,
      productId: `product-${index}`,
      productName: product.name,
      categoryName: product.category,
      quantity: Math.floor(quantity),
      value: Math.floor(quantity * (50 + Math.random() * 100)),
      timestamp: date.toISOString(),
      createdAt: date.toISOString(),
    }
  })
}

// Data processing utility
const processChartData = (data: InventoryChartData[]): ProcessedChartData[] => {
  if (!data || data.length === 0) return []

  // Type for grouped data
  type GroupedData = Record<
    string,
    {
      date: string
      quantity: number
      formattedDate: string
      items: InventoryChartData[]
    }
  >

  // Group by date and sum quantities
  const groupedData = data.reduce((acc: GroupedData, item) => {
    const date = format(parseISO(item.createdAt), 'yyyy-MM-dd')

    if (!acc[date]) {
      acc[date] = {
        date,
        quantity: 0,
        formattedDate: format(parseISO(item.createdAt), 'MMM dd'),
        items: [],
      }
    }

    acc[date].quantity += item.quantity
    acc[date].items.push(item)

    return acc
  }, {})

  // Convert to array and sort by date
  return Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

// Chart configuration
const chartConfig: ChartConfig = {
  quantity: {
    label: 'Inventory Quantity',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

// Loading skeleton component
const ChartSkeleton: React.FC<{ height: number }> = ({ height }) => (
  <div className="bg-muted animate-pulse rounded-lg" style={{ height }}>
    <div className="from-muted via-muted/50 to-muted h-full w-full rounded-lg bg-gradient-to-r" />
  </div>
)

// Main component
export const InventoryAreaChart: React.FC<InventoryAreaChartProps> = ({
  data,
  isLoading = false,
  className,
  height = 350,
  showGrid = true,
  showTooltip = true,
  gradientId = 'inventoryGradient',
  color = 'hsl(var(--chart-1))',
  title,
}) => {
  // Use dummy data if no real data is provided
  const dummyData = React.useMemo(() => generateDummyData(), [])
  const chartData = React.useMemo(() => {
    const sourceData = data && data.length > 0 ? data : dummyData
    return processChartData(sourceData)
  }, [data, dummyData])

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn('flex h-full w-full flex-col', className)}
        style={{ minHeight: height }}
      >
        {title && (
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="min-h-0 w-full flex-1">
          <ChartSkeleton height={height} />
        </div>
      </div>
    )
  }

  // Show empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div
        className={cn('flex h-full w-full flex-col', className)}
        style={{ minHeight: height }}
      >
        {title && (
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="min-h-0 w-full flex-1">
          <div
            className="bg-muted/20 border-muted-foreground/25 flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed"
            style={{ minHeight: height }}
          >
            <div className="text-muted-foreground text-center">
              <div className="text-sm">No inventory data available</div>
              <div className="mt-1 text-xs">
                Data will appear here when available
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('flex h-full w-full flex-col', className)}
      style={{ minHeight: height }}
    >
      {title && (
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">
            {data && data.length > 0 ? 'Live data' : 'Sample data'} •{' '}
            {chartData.length} data points
          </p>
        </div>
      )}

      <div className="min-h-0 w-full flex-1">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full [&_.recharts-responsive-container]:!h-full [&_.recharts-responsive-container]:!w-full [&>div]:!aspect-auto [&>div]:h-full [&>div]:w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
            )}

            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              }}
              dx={-10}
              tickFormatter={value => `${value}`}
            />

            {showTooltip && (
              <ChartTooltip
                cursor={{
                  stroke: color,
                  strokeWidth: 1,
                  strokeOpacity: 0.5,
                }}
                content={
                  <ChartTooltipContent
                    className="min-w-[200px]"
                    formatter={(value, name) => [
                      <span key={name} className="font-medium">
                        {Number(value).toLocaleString()} units
                      </span>,
                      name,
                    ]}
                    labelFormatter={label => `Date: ${label}`}
                  />
                }
              />
            )}

            <Area
              type="monotone"
              dataKey="quantity"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              connectNulls={false}
              dot={{
                fill: color,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: color,
                strokeWidth: 2,
                fill: 'hsl(var(--background))',
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

// Export default for easier imports
export default InventoryAreaChart

// Additional utility exports
export { generateDummyData, processChartData }
