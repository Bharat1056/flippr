export type ProductStatus = 'Good' | 'Low' | 'Critical'

export interface Product {
  id: string
  name: string
  category: string
  numberOfStocks: number
  threshold: number
}