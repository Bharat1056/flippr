export interface ProductCardProps {
  id: string
  currentRole: string
  name: string
  image: string
  stockPrice: number
  thresholdPrice: number
  staffName?: string
  createdAt: string
  barcode: string
  category: string
  className?: string
}
