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

export const EditProductModal = ({
  open,
  onClose,
  product,
}: EditProductModalProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      stockPrice: 0,
      thresholdPrice: 0,
      description: '',
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        stockPrice: product.stockPrice,
        thresholdPrice: product.thresholdPrice,
        description: product.description || '',
      })
    }
  }, [product, reset])

  const onSubmit = async (data: any) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
