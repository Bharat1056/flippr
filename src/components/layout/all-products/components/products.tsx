"use client"
import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, ProductStatus } from '../types/index';


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
];

function getStatus(product: Product): ProductStatus {
  if (product.numberOfStocks < product.threshold) return 'Critical';
  if (product.numberOfStocks === product.threshold) return 'Low';
  return 'Good';
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [editStockId, setEditStockId] = useState<string | null>(null);
  const [newStockLevel, setNewStockLevel] = useState(0);
  const [note, setNote] = useState('');



  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const status = getStatus(p);
      const matchStatus = statusFilter === 'all' || status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  const handleUpdateStock = () => {
    if (editStockId) {
      setProducts(prev =>
        prev.map(p => (p.id === editStockId ? { ...p, numberOfStocks: newStockLevel } : p))
      );
      setEditStockId(null);
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-xl text-gray-900">Product Stock Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] border-gray-300 focus:ring-blue-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-gray-300 focus:ring-blue-500">
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

        {/* Table */}
        <div className="overflow-auto rounded-md border border-gray-200">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Product</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                <TableHead className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {filtered.map(product => {
                const status = getStatus(product);
                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                    <TableCell className="text-gray-700">{product.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={`text-lg font-bold ${
                          status === 'Good' ? 'text-green-600' :
                          status === 'Low' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {product.numberOfStocks}
                        </span>
                        <span className="text-sm">
                          {status === 'Good' ? '📈' : '📉'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Min: {product.threshold}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === 'Good'
                            ? 'default'
                            : status === 'Low'
                            ? 'outline'
                            : 'destructive'
                        }
                        className={`${
                          status === 'Good'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : status === 'Low'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={editStockId === product.id}
                        onOpenChange={open =>
                          open
                            ? setEditStockId(product.id)
                            : setEditStockId(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setNewStockLevel(product.numberOfStocks);
                              setEditStockId(product.id);
                            }}
                            className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 focus:ring-blue-500"
                          >
                            Update Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle>Update Stock</DialogTitle>
                            <p className="text-sm text-gray-600">
                              {product.name}
                            </p>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Current</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  {product.numberOfStocks}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getStatus(product)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">New</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  {newStockLevel}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getStatus({
                                    ...product,
                                    numberOfStocks: newStockLevel,
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewStockLevel(v => Math.max(0, v - 10))}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                -10
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewStockLevel(v => Math.max(0, v - 1))}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                value={newStockLevel}
                                onChange={e =>
                                  setNewStockLevel(Number(e.target.value))
                                }
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewStockLevel(v => v + 1)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                +
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewStockLevel(v => v + 10)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                +10
                              </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {[0, 25, 50, 100].map(preset => (
                                <Button
                                  key={preset}
                                  variant="secondary"
                                  onClick={() => setNewStockLevel(preset)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-900"
                                >
                                  {preset}
                                </Button>
                              ))}
                            </div>
                            {/* input field to add description */}
                            <div>
                                <Input
                                    placeholder="Add a note (optional)"
                                    className="mt-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                onClick={() => setEditStockId(null)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleUpdateStock}
                                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-8 w-8 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-8 w-8 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    No products found matching current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
