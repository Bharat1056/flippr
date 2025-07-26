export interface Product {
  id: string
  name: string
  price: number
  description: string
}



export interface EditProductModalProps {
  open: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    stockPrice: number
    thresholdPrice: number
    description?: string
  }
}
