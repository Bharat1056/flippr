// ProductList.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Search } from 'lucide-react'
import { Product, ProductStatus } from '../types/index'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    numberOfStocks: 70,
    threshold: 10,
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    numberOfStocks: 8,
    threshold: 5,
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    numberOfStocks: 3,
    threshold: 15,
  },
  {
    id: '4',
    name: 'JavaScript: The Good Parts',
    category: 'Books',
    numberOfStocks: 2,
    threshold: 5,
  },
  {
    id: '5',
    name: 'Wireless Headphones',
    category: 'Electronics',
    numberOfStocks: 45,
    threshold: 20,
  },
  {
    id: '6',
    name: 'Garden Hose',
    category: 'Home & Garden',
    numberOfStocks: 12,
    threshold: 8,
  },
]

function getStatus(product: Product): ProductStatus {
  if (product.numberOfStocks < product.threshold) return 'Critical'
  if (product.numberOfStocks === product.threshold) return 'Low'
  return 'Good'
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [editStockId, setEditStockId] = useState<string | null>(null)
  const [newStockLevel, setNewStockLevel] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter
      const status = getStatus(p)
      const matchStatus = statusFilter === 'all' || status === statusFilter
      return matchSearch && matchCategory && matchStatus
    })
  }, [products, debouncedSearch, categoryFilter, statusFilter])

  const handleUpdateStock = () => {
    if (editStockId) {
      setProducts(prev =>
        prev.map(p => (p.id === editStockId ? { ...p, numberOfStocks: newStockLevel } : p))
      )
      setEditStockId(null)
    }
  }

  const categories = Array.from(new Set(products.map(p => p.category)))

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
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

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quick Edit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(product => {
              const status = getStatus(product)
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.numberOfStocks}
                      <span className="text-xs text-muted-foreground">Min: {product.threshold}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      status === 'Good' ? 'default' : status === 'Low' ? 'outline' : 'destructive'
                    }>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={editStockId === product.id} onOpenChange={open => open ? setEditStockId(product.id) : setEditStockId(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => {
                          setNewStockLevel(product.numberOfStocks)
                          setEditStockId(product.id)
                        }}>
                          Update Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Update Stock</DialogTitle>
                          <p className="text-sm text-muted-foreground">{product.name}</p>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm">Current</p>
                              <p className="text-2xl font-bold">{product.numberOfStocks}</p>
                              <p className="text-xs text-muted-foreground">{getStatus(product)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm">New</p>
                              <p className="text-2xl font-bold">{newStockLevel}</p>
                              <p className="text-xs text-muted-foreground">{getStatus({ ...product, numberOfStocks: newStockLevel })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setNewStockLevel(v => v - 10)}>-10</Button>
                            <Button variant="outline" size="sm" onClick={() => setNewStockLevel(v => v - 1)}>-</Button>
                            <Input
                              type="number"
                              className="w-full"
                              value={newStockLevel}
                              onChange={e => setNewStockLevel(Number(e.target.value))}
                            />
                            <Button variant="outline" size="sm" onClick={() => setNewStockLevel(v => v + 1)}>+</Button>
                            <Button variant="outline" size="sm" onClick={() => setNewStockLevel(v => v + 10)}>+10</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {[0, 25, 50, 100].map(preset => (
                              <Button key={preset} variant="secondary" onClick={() => setNewStockLevel(preset)}>{preset}</Button>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setEditStockId(null)}>Cancel</Button>
                            <Button onClick={handleUpdateStock}>Update</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProductList
