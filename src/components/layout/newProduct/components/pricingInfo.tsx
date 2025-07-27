import React from 'react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PricingInfoStepProps } from '../types/index'

const PricingInfoStep: React.FC<PricingInfoStepProps> = ({
  form,
  calculateNetPrice,
  handleNext,
  handleBack,
  loading,
}) => {
  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Pricing Information
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="stockPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1200.00"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Quantity
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="thresholdPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Threshold
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Net Price (Auto-calculated)
            </FormLabel>
            <FormControl>
              <Input
                value={`${calculateNetPrice()}`}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </FormControl>
          </FormItem>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between pt-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          type="button"
          className="text-gray-600 hover:text-gray-700"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="rounded-md bg-gray-800 px-6 py-2 text-white hover:bg-gray-900"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  )
}

export default PricingInfoStep
