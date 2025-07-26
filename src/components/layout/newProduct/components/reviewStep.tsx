import React from 'react';
import { Button } from '@/components/ui/button';
import { ReviewStepProps } from '../types/index';

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  form, 
  calculateNetPrice,
  formatCurrency,
  handleBack,
  loading 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 p-6 pb-0">Product Page Preview</h1>

      <img 
        src="/uploaded_images/Screenshot 2025-07-26 193337.png-b368e23b-a5f9-40d2-9f30-b8dc521e9011" 
        alt="Product Image" 
        className="w-full h-64 object-cover" 
      />

      <div className="p-6 space-y-6">
        <div className="product-info">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📦</span> Product Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Product ID:</div>
            <div className="text-gray-800">{form.watch('productId') || 'N/A'}</div>

            <div className="text-gray-500">Name:</div>
            <div className="text-gray-800">{form.watch('name') || 'N/A'}</div>

            <div className="text-gray-500">Category:</div>
            <div className="text-gray-800">{form.watch('category') || 'N/A'}</div>

            <div className="text-gray-500">Status:</div>
            <div className="text-red-500 font-medium">{form.watch('status') || 'N/A'}</div>

            <div className="text-gray-500 col-span-2 mt-4">Description:</div>
            <div className="text-gray-800 col-span-2">{form.watch('description') || 'N/A'}</div>
          </div>
        </div>

        <div className="pricing-info">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">💲</span> Pricing Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Stock Price:</div>
            <div className="text-red-500 font-medium">{formatCurrency(form.watch('stockPrice'))}</div>

            <div className="text-gray-500">Quantity:</div>
            <div className="text-gray-800">{form.watch('stockQuantity') || 'N/A'}</div>

            <div className="text-gray-500">Net Price:</div>
            <div className="text-green-600 font-medium">${calculateNetPrice()}</div>

            <div className="text-gray-500">Threshold Price:</div>
            <div className="text-gray-800">{formatCurrency(form.watch('thresholdPrice'))}</div>
          </div>
        </div>

        <div className="additional-info">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">ℹ️</span> Additional Information
          </h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">Staff:</div>
            <div className="text-gray-800">{form.watch('staff') || 'N/A'}</div>

            <div className="text-gray-500">Admin:</div>
            <div className="text-gray-800">{form.watch('admin') || 'N/A'}</div>

            <div className="text-gray-500">Created:</div>
            <div className="text-gray-800">
              {form.watch('createdAt') ? new Date(form.watch('createdAt')).toLocaleString() : 'N/A'}
            </div>

            <div className="text-gray-500">Barcode:</div>
            <div className="text-gray-800">{form.watch('barcode') || 'N/A'}</div>

            <div className="text-gray-500">SKU:</div>
            <div className="text-gray-800">{form.watch('sku') || 'N/A'}</div>

            <div className="text-gray-500">Brand:</div>
            <div className="text-gray-800">{form.watch('brand') || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-6 pt-0">
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
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
