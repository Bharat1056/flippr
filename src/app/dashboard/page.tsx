'use client'

import React, { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, AlertTriangle } from 'lucide-react'
import { useCategories } from '@/lib/hooks/use-products'
import { DashboardHeader } from '@/components/layout/dashboard/components/dashboard-header'
import { ProductList } from '@/components/layout/dashboard/components/product-list'

const ITEMS_PER_PAGE = 12

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL state management
  const currentPage = parseInt(searchParams.get('page') || '1')
  const currentCategory = searchParams.get('category') || 'all'
  const currentSearch = searchParams.get('search') || ''
  const currentSort = searchParams.get('sort') || 'createdAt'
  const currentOrder = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

  // Local state
  const [searchInput, setSearchInput] = useState(currentSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Update URL when filters change
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (currentCategory !== 'all') params.set('category', currentCategory)
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (currentSort !== 'createdAt') params.set('sort', currentSort)
    if (currentOrder !== 'desc') params.set('order', currentOrder)

    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/dashboard${newUrl}`, { scroll: false })
  }, [
    currentPage,
    currentCategory,
    debouncedSearch,
    currentSort,
    currentOrder,
    router,
  ])

  // Query filters
  const filters = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      category: currentCategory === 'all' ? undefined : currentCategory,
      sortBy: currentSort as
        | 'name'
        | 'stockPrice'
        | 'thresholdPrice'
        | 'createdAt'
        | 'category',
      sortOrder: currentOrder,
    }),
    [currentPage, debouncedSearch, currentCategory, currentSort, currentOrder]
  )

  // Data fetching
  const { data: categories = [], error: categoriesError } = useCategories()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('category', category)
    params.delete('page')
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    params.delete('page')
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleOrderChange = (order: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams)
    params.set('order', order)
    params.delete('page')
    router.push(`/dashboard?${params.toString()}`)
  }

  // Handle error state
  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h3 className="text-destructive mb-2 text-lg font-semibold">
                Error Loading Categories
              </h3>
              <p className="text-muted-foreground">
                Failed to load categories. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header with Stats */}
      <DashboardHeader />
      

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={currentCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="stockPrice">Stock Price</SelectItem>
                <SelectItem value="thresholdPrice">Threshold Price</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={currentOrder} onValueChange={handleOrderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(currentCategory !== 'all' || debouncedSearch) && (
            <div className="flex flex-wrap gap-2">
              {currentCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Category: {currentCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => handleCategoryChange('all')}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {debouncedSearch && (
                <Badge variant="secondary" className="gap-1">
                  Search: {debouncedSearch}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => setSearchInput('')}
                  >
                    ×
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products List */}
      <ProductList filters={filters} />
    </div>
  )
}
