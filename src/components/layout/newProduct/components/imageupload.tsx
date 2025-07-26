// components/ProductForm/ImageUpload.jsx
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { ImageUploadProps } from '../types/index';

const ImageUpload: React.FC<ImageUploadProps> = ({ uploadedImages, handleImageUpload, removeImage }) => {
  return (
    <div className="mb-8">
      <FormLabel className="block text-sm font-medium text-gray-700 mb-3">Image</FormLabel>
      
      {uploadedImages.length === 0 ? (
        <div className="w-full max-w-md mx-auto">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50/50"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-blue-600 hover:text-blue-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">JPG, JPEG, PNG (max 1MB)</p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}

          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="add-more-images"
            />
            <label
              htmlFor="add-more-images"
              className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;