import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ITEMS_PER_PAGE_DASHBOARD } from '../constants'

export const ProductLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: ITEMS_PER_PAGE_DASHBOARD }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="bg-muted h-48" />
          <CardHeader className="pb-3">
            <div className="bg-muted h-4 w-3/4 rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="bg-muted h-3 rounded" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
