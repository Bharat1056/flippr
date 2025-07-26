import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ImageUpload from './imageupload';
import AdditionalInfoSection from './additionalInfo';
import { ProductInfoStepProps } from '../types/index';

const ProductInfoStep: React.FC<ProductInfoStepProps> = ({ 
  form, 
  uploadedImages, 
  handleImageUpload, 
  removeImage,
  additionalInfoExpanded,
  setAdditionalInfoExpanded,
  handleNext,
  loading,
  router 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Product Information</h1>

      <ImageUpload 
        uploadedImages={uploadedImages}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
      />

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name Product"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Product ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="PROD001"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="Electronics"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Description <span className="text-gray-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px] resize-none"
                  {...field}
                />
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

      <div className="flex justify-between items-center mt-12 pt-6">
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
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfoStep;