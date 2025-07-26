'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { EditProductModalProps } from '../types/index'
import { zodResolver } from '@hookform/resolvers/zod'
import { editProductSchema, type EditProductFormData } from '../../types'

export const EditProductModal = ({
  open,
  onClose,
  product,
}: EditProductModalProps) => {
  const { register, handleSubmit, reset } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      stockPrice: '',
      thresholdPrice: '',
      description: '',
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        stockPrice: String(product.stockPrice),
        thresholdPrice: String(product.thresholdPrice),
        description: product.description || '',
      })
    }
  }, [open, product, reset])

  const onSubmit = async (data: EditProductFormData) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    console.log('Updated Data:', data)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('name')} placeholder="Product Name" />
          <Input
            type="number"
            {...register('stockPrice')}
            placeholder="Stock Price"
          />
          <Input
            type="number"
            {...register('thresholdPrice')}
            placeholder="Threshold Price"
          />
          <Input {...register('description')} placeholder="Description" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
