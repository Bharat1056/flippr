import React from 'react'
import { Button } from '@/components/ui/button'
import { ReviewStepProps } from '../types/index'
import Image from 'next/image'

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  calculateNetPrice,
  formatCurrency,
  handleBack,
  loading,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <h1 className="mb-6 p-6 pb-0 text-2xl font-bold text-gray-800">
        Product Page Preview
      </h1>

      <Image
        src="https://images.unsplash.com/photo-1750440700610-3e728303b2ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Product Image"
        className="h-64 w-full object-cover"
        width={100}
        height={100}
      />

      <div className="space-y-6 p-6">
        <div className="product-info">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <span className="mr-2">📦</span> Product Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Name:</div>
            <div className="text-gray-800">{form.watch('name') || 'N/A'}</div>

            <div className="text-gray-500">Category:</div>
            <div className="text-gray-800">
              {form.watch('category') || 'N/A'}
            </div>

            <div className="text-gray-500">Description:</div>
            <div className="text-gray-800">
              {form.watch('description') || 'N/A'}
            </div>
          </div>
        </div>

        <div className="pricing-info">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <span className="mr-2">💲</span> Pricing Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Stock Price:</div>
            <div className="font-medium text-red-500">
              {formatCurrency(form.watch('stockPrice'))}
            </div>

            <div className="text-gray-500">Quantity:</div>
            <div className="text-gray-800">
              {form.watch('stockQuantity') || 'N/A'}
            </div>

            <div className="text-gray-500">Net Price:</div>
            <div className="font-medium text-green-600">
              ${calculateNetPrice()}
            </div>

            <div className="text-gray-500">Threshold Price:</div>
            <div className="text-gray-800">
              {formatCurrency(form.watch('thresholdPrice'))}
            </div>
          </div>
        </div>

        <div className="additional-info">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <span className="mr-2">ℹ️</span> Additional Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Staff:</div>
            <div className="text-gray-800">{form.watch('staff') || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 pt-0">
        <Button
          variant="ghost"
          onClick={handleBack}
          type="button"
          className="text-gray-600 hover:text-gray-700"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-800 px-6 py-2 text-white hover:bg-gray-900"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </div>
    </div>
  )
}

export default ReviewStep
