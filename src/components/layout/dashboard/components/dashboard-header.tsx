import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Tag,
  User2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddCategoryModal } from './add-category-modal'
import { Product } from '@/lib/types/product.types'
import { PaginatedResponse } from '@/lib/types/api.types'
import { useAppSelector } from '@/lib/store/hooks'

interface DashboardHeaderProps {
  productsData?: PaginatedResponse<Product>
}

export const DashboardHeader = ({ productsData }: DashboardHeaderProps) => {
  const router = useRouter()

  const { user } = useAppSelector(state => state.auth)

  // Calculate stats dynamically from products data
  const calculateStats = () => {
    if (!productsData?.products) {
      return {
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        aboveThresholdCount: 0,
      }
    }

    const products = productsData.products
    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => {
      const price = (product as any).value || product.value // eslint-disable-line @typescript-eslint/no-explicit-any
      return sum + (price || 0)
    }, 0)
    const lowStockCount = products.filter(product => {
      const quantity = (product as any).numberOfStocks || product.numberOfStocks // eslint-disable-line @typescript-eslint/no-explicit-any
      return (quantity || 0) < 10
    }).length

    const aboveThresholdCount = products.filter(product => {
      return product.status === 'CRITICAL'
    }).length

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      aboveThresholdCount,
    }
  }

  const stats = calculateStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your product inventory
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2">
            <AddCategoryModal>
              <Button variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </AddCategoryModal>
            <Button onClick={() => router.push('/product/new')}>
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button onClick={() => router.push(`/add-staff/${user?.id}`)}>
              <User2 className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.lowStockCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Above Threshold
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.aboveThresholdCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
