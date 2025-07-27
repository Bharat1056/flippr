import React from 'react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageUpload from './imageupload'
import AdditionalInfoSection from './additionalInfo'
import { ProductInfoStepProps } from '../types/index'
import { useCategories } from '@/lib/hooks/use-categories'

const ProductInfoStep: React.FC<ProductInfoStepProps> = ({
  form,
  uploadedImages,
  handleImageUpload,
  removeImage,
  additionalInfoExpanded,
  setAdditionalInfoExpanded,
  handleNext,
  loading,
  router,
}) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Product Information
      </h1>

      <ImageUpload
        uploadedImages={uploadedImages}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
      />

      <div className="space-y-6">
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Name Product"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Description{' '}
                <span className="font-normal text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="mt-1 block min-h-[120px] w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Category
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="All Categories" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AdditionalInfoSection
        form={form}
        additionalInfoExpanded={additionalInfoExpanded}
        setAdditionalInfoExpanded={setAdditionalInfoExpanded}
      />

      <div className="mt-12 flex items-center justify-between pt-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          type="button"
          className="text-gray-600 hover:text-gray-700"
        >
          Cancel
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

export default ProductInfoStep
