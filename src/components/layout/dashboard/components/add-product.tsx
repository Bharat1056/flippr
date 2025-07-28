import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddProductProps } from '../types'

export const AddProduct = ({
  debouncedSearch,
  currentCategory,
  role,
}: AddProductProps) => {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearch || currentCategory !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first product.'}
          </p>
          {role === 'ADMIN' && (
            <Button onClick={() => router.push('/product/new')}>
              Add Product
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
