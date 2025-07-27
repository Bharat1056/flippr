'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  InventoryLogActionType,
  SortField,
  SortOrder,
} from '@/lib/types/inventory.types'
import { Search, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useInventoryLogs } from '@/lib/hooks/use-inventory'
import { useRouter, useSearchParams } from 'next/navigation'

const InventoryActivityLog: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filters from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const debouncedSearch = searchParams.get('search') || ''
  const currentActionType = searchParams.get('actionType') || 'ALL'
  const currentSortField =
    (searchParams.get('sortField') as SortField) || 'DATE'
  const currentSortOrder =
    (searchParams.get('sortOrder') as SortOrder) || 'desc'

  // Create filters object
  const filters = {
    search: debouncedSearch,
    actionType:
      currentActionType === 'ALL'
        ? undefined
        : (currentActionType as InventoryLogActionType),
    sortField: currentSortField,
    sortOrder: currentSortOrder,
    page: currentPage,
    limit: 20,
  }

  // Fetch data from backend
  const {
    data: inventoryLogsData,
    isLoading: inventoryLogsLoading,
    error: inventoryLogsError,
  } = useInventoryLogs(filters)

  console.log('inventoryLogsData', inventoryLogsData)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/activity-log?${params.toString()}`)
  }

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset to first page
    router.push(`/activity-log?${params.toString()}`)
  }

  const handleActionTypeChange = (actionType: string) => {
    const params = new URLSearchParams(searchParams)
    if (actionType === 'ALL') {
      params.delete('actionType')
    } else {
      params.set('actionType', actionType)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/activity-log?${params.toString()}`)
  }

  const handleSortFieldChange = (sortField: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sortField', sortField)
    params.set('page', '1') // Reset to first page
    router.push(`/activity-log?${params.toString()}`)
  }

  const handleSortOrderChange = (sortOrder: SortOrder) => {
    const params = new URLSearchParams(searchParams)
    params.set('sortOrder', sortOrder)
    params.set('page', '1') // Reset to first page
    router.push(`/activity-log?${params.toString()}`)
  }

  // Handle error state
  if (inventoryLogsError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
            <h3 className="text-destructive mb-2 text-lg font-semibold">
              Error Loading Inventory Logs
            </h3>
            <p className="text-muted-foreground">
              Failed to load inventory logs. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-4 md:w-auto">
            <div className="relative w-full md:max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search products or users..."
                className="pl-10"
                defaultValue={debouncedSearch}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>
            <Select
              value={currentActionType}
              onValueChange={val => handleActionTypeChange(val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value={InventoryLogActionType.INCREASE}>
                  Increased
                </SelectItem>
                <SelectItem value={InventoryLogActionType.DECREASE}>
                  Decreased
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Field */}
            <Select
              value={currentSortField}
              onValueChange={handleSortFieldChange}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DATE">Date & Time</SelectItem>
                <SelectItem value="NAME">Alphabetical</SelectItem>
                <SelectItem value="QUANTITY">Quantity</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSortOrderChange(
                  currentSortOrder === 'asc' ? 'desc' : 'asc'
                )
              }
              className="flex items-center gap-1"
            >
              {currentSortOrder === 'asc' ? (
                <>
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-xs">Asc</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-xs">Desc</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {inventoryLogsLoading ? (
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
            <div className="overflow-auto rounded-md border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-4 py-2">Date & Time</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryLogsData?.logs?.map(log => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/50 border-t transition-colors"
                    >
                      <td className="px-4 py-2">
                        {new Date(log.createdAt).toLocaleDateString()} <br />
                        <span className="text-muted-foreground text-xs">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div>{log.product?.name || 'N/A'}</div>
                        <div className="text-muted-foreground text-xs">
                          {log.product?.categoryName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            log.actionType === InventoryLogActionType.INCREASE
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          )}
                        >
                          {log.actionType === InventoryLogActionType.INCREASE
                            ? 'Increase'
                            : 'Decrease'}
                        </Badge>
                      </td>
                      <td
                        className={cn(
                          'px-4 py-2 font-semibold',
                          log.quantity.startsWith('+')
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {log.quantity}
                      </td>
                      <td className="px-4 py-2">
                        {log.staff ? (
                          <>
                            <div>{log.staff.fullName}</div>
                            <div className="text-muted-foreground text-xs">
                              {log.staff.username}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Staff
                            </div>
                          </>
                        ) : log.admin ? (
                          <>
                            <div>{log.admin.fullName}</div>
                            <div className="text-muted-foreground text-xs">
                              {log.admin.username}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Admin
                            </div>
                          </>
                        ) : (
                          <div className="text-muted-foreground">
                            Unknown User
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">{log.note}</td>
                    </tr>
                  ))}

                  {(!inventoryLogsData?.logs ||
                    inventoryLogsData.logs.length === 0) && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-muted-foreground px-4 py-6 text-center"
                      >
                        No logs match the current filter/search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {inventoryLogsData?.pagination &&
              inventoryLogsData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!inventoryLogsData.pagination.hasPrevPage}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          inventoryLogsData.pagination.totalPages
                        ),
                      },
                      (_, i) => {
                        const page = i + 1
                        if (inventoryLogsData.pagination.totalPages <= 5) {
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
                          page === inventoryLogsData.pagination.totalPages ||
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
                    disabled={!inventoryLogsData.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default InventoryActivityLog
