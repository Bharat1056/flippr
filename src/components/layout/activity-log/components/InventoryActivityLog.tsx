'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
import { InventoryLogItem, InventoryLogActionType, SortField, SortOrder } from '../types/index'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from 'lucide-react'

const MOCK_LOGS: InventoryLogItem[] = [
    {
        id: '1',
        description: 'Sold to customer',
        actionType: InventoryLogActionType.DECREASE,
        createdAt: '2024-01-20T20:00:00',
        quantity: -25,
        product: {
            id: 'p1',
            name: 'iPhone 15 Pro',
            category: 'Electronics',
            code: 'IPH-15-PRO-001',
        },
        staff: {
            id: 's1',
            name: 'Staff User',
            email: 'staff@inventory.com',
        },
    },
    {
        id: '2',
        description: 'Bulk order fulfillment',
        actionType: InventoryLogActionType.DECREASE,
        createdAt: '2024-01-22T18:50:00',
        quantity: -47,
        product: {
            id: 'p2',
            name: 'Cotton T-Shirt',
            code: 'TSH-COT-001',
            category: 'Clothing',
        },
        staff: {
            id: 's1',
            name: 'Staff User',
            email: 'staff@inventory.com',
        },
    },
    {
        id: '3',
        description: 'Library donation',
        actionType: InventoryLogActionType.DECREASE,
        createdAt: '2024-01-25T15:45:00',
        quantity: -3,
        product: {
            id: 'p3',
            name: 'JavaScript: The Good Parts',
            code: 'BOOK-JS-001',
            category: 'Books',
        },
        admin: {
            id: 'a1',
            name: 'Admin User',
            email: 'admin@inventory.com',
        },
    },
    {
        id: '4',
        description: 'Initial stock',
        actionType: InventoryLogActionType.INCREASE,
        createdAt: '2024-01-15T15:30:00',
        quantity: 50,
        product: {
            id: 'p1',
            name: 'iPhone 15 Pro',
            code: 'IPH-15-PRO-001',
            category: 'Electronics',
        },
        admin: {
            id: 'a1',
            name: 'Admin User',
            email: 'admin@inventory.com',
        },
    },
    {
        id: '5',
        description: 'New shipment received',
        actionType: InventoryLogActionType.INCREASE,
        createdAt: '2024-01-23T21:00:00',
        quantity: 45,
        product: {
            id: 'p4',
            name: 'Wireless Headphones',
            code: 'WH-001',
            category: 'Electronics',
        },
        admin: {
            id: 'a1',
            name: 'Admin User',
            email: 'admin@inventory.com',
        },
    },
]

const InventoryActivityLog: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [filterType, setFilterType] = useState<'ALL' | InventoryLogActionType>('ALL')
    const [sortField, setSortField] = useState<SortField>('DATE')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const filteredLogs = useMemo(() => {
        let logs = [...MOCK_LOGS]

        // Filter
        logs = logs.filter(log => {
            const matchesFilter =
                filterType === 'ALL' || log.actionType === filterType

            const matchesSearch =
                log.product?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                log.staff?.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                log.admin?.email.toLowerCase().includes(debouncedSearch.toLowerCase())

            return matchesFilter && matchesSearch
        })

        // Sort
        logs.sort((a, b) => {
            let comparison = 0

            if (sortField === 'DATE') {
                comparison =
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            } else if (sortField === 'QUANTITY') {
                comparison = a.quantity - b.quantity
            } else if (sortField === 'NAME') {
                comparison = (a.product?.name || '').localeCompare(b.product?.name || '')
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return logs
    }, [debouncedSearch, filterType, sortField, sortOrder])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className='flex items-center gap-4 w-full md:w-auto'>
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products or users..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />

                        </div>
                        <Select
                            value={filterType}
                            onValueChange={val =>
                                setFilterType(val as 'ALL' | InventoryLogActionType)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Actions</SelectItem>
                                <SelectItem value={InventoryLogActionType.INCREASE}>Increased</SelectItem>
                                <SelectItem value={InventoryLogActionType.DECREASE}>Decreased</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Sort Field */}
                        <Select value={sortField} onValueChange={(val) => setSortField(val as SortField)}>
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
                            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                            className="flex items-center gap-1"
                        >
                            {sortOrder === 'asc' ? (
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
                            {filteredLogs.map(log => (
                                <tr
                                    key={log.id}
                                    className="border-t hover:bg-muted/50 transition-colors"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(log.createdAt).toLocaleDateString()} <br />
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(log.createdAt).toLocaleTimeString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div>{log.product?.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {log.product?.category}
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
                                            log.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                        )}
                                    >
                                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                                    </td>
                                    <td className="px-4 py-2">
                                        {log.staff ? (
                                            <>
                                                <div>{log.staff.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {log.staff.email}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Staff</div>
                                            </>
                                        ) : (
                                            <>
                                                <div>{log.admin?.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {log.admin?.email}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Admin</div>
                                            </>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{log.description}</td>
                                </tr>
                            ))}

                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                                        No logs match the current filter/search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

export default InventoryActivityLog