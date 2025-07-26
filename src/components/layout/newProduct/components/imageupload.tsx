// components/ProductForm/ImageUpload.jsx
import React from 'react'
import { FormLabel } from '@/components/ui/form'
import { ImageUploadProps } from '../types/index'
import Image from 'next/image'

const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadedImages,
  handleImageUpload,
  removeImage,
}) => {
  return (
    <div className="mb-8">
      <FormLabel className="mb-3 block text-sm font-medium text-gray-700">
        Image
      </FormLabel>

      {uploadedImages.length === 0 ? (
        <div className="mx-auto w-full max-w-md">
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
            className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center transition-colors hover:border-gray-400"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-blue-600 hover:text-blue-700">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPG, JPEG, PNG (max 1MB)
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="group relative">
              <Image
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
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
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200 transition-colors hover:border-gray-400 hover:bg-gray-300"
            >
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
