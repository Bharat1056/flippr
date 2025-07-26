'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProductSchema, AddProductFormData } from '@/components/common/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

export function AddProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      productId: '',
      name: '',
      category: '',
      status: '',
      description: '',
      stockPrice: '',
      thresholdPrice: '',
      staff: '',
      admin: '',
      createdAt: '',
      barcode: '',
      stockQuantity: '',
      sku: '',
      brand: '',
      tags: [],
    },
  })

  const onSubmit = async (data: AddProductFormData) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000)) // Reduced timeout for quicker testing
    console.log('Product submitted:', data)
    router.push('/dashboard')
    setLoading(false) // Set loading to false after submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-6 border rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pr-4 hide-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)' }}> {/* Adjust maxHeight as needed */}
          {/* Product Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl><Input placeholder="e.g., PROD001" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Laptop Pro X" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Electronics" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl><Input placeholder="e.g., In Stock" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Provide a detailed description of the product." {...field} /></FormControl>
                  <FormDescription>A brief overview of the product for customers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pricing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Price ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1200.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thresholdPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold Price ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1000.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="staff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff</FormLabel>
                    <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="admin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin</FormLabel>
                    <FormControl><Input placeholder="e.g., Jane Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created At</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl><Input placeholder="e.g., 123456789012" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl><Input placeholder="e.g., LPX-ABC-001" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl><Input placeholder="e.g., TechCorp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-6">
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </form>
    </Form>
  )
}