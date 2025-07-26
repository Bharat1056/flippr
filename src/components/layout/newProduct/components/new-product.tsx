'use client'

import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProductSchema, AddProductFormData } from '@/components/common/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Circle } from 'lucide-react'
import ProductInfoStep from './productInfo'
import PricingInfoStep from './pricingInfo'
import ReviewStep from './reviewStep'

type FormStep = 'productInfo' | 'pricingInfo' | 'review'

const AddProductForm: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<FormStep>('productInfo')
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

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
    console.log('Final product data submitted:', data)
    await new Promise(resolve => setTimeout(resolve, 10000))
    router.push('/dashboard')
    setLoading(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') && file.size <= 1024 * 1024) {
          // 1MB limit
          const reader = new FileReader()
          reader.onload = e => {
            if (e.target?.result) {
              setUploadedImages(prev => [...prev, e.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = async () => {
    let isValid = false
    if (currentStep === 'productInfo') {
      isValid = await form.trigger([
        'productId',
        'name',
        'category',
        'description',
      ])
      if (isValid) setCurrentStep('pricingInfo')
    } else if (currentStep === 'pricingInfo') {
      isValid = await form.trigger([
        'stockPrice',
        'thresholdPrice',
        'stockQuantity',
      ])
      if (isValid) setCurrentStep('review')
    }
  }

  const handleBack = () => {
    if (currentStep === 'pricingInfo') {
      setCurrentStep('productInfo')
    } else if (currentStep === 'review') {
      setCurrentStep('pricingInfo')
    }
  }

  const getStepStatus = (step: FormStep) => {
    if (currentStep === step) return 'current'
    if (
      step === 'productInfo' &&
      (currentStep === 'pricingInfo' || currentStep === 'review')
    )
      return 'completed'
    if (step === 'pricingInfo' && currentStep === 'review') return 'completed'
    return 'pending'
  }

  // Calculate net price
  const calculateNetPrice = () => {
    const price = parseFloat(form.watch('stockPrice') || '0')
    const quantity = parseFloat(form.watch('stockQuantity') || '0')
    return (price * quantity).toFixed(2)
  }

  // Helper function to format currency
  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === '') return 'N/A'
    const num = Number(value)
    if (isNaN(num)) return 'N/A'
    return `$${num.toFixed(2)}`
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'productInfo':
        return (
          <ProductInfoStep
            form={form}
            uploadedImages={uploadedImages}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            additionalInfoExpanded={additionalInfoExpanded}
            setAdditionalInfoExpanded={setAdditionalInfoExpanded}
            handleNext={handleNext}
            loading={loading}
            router={router}
          />
        )

      case 'pricingInfo':
        return (
          <PricingInfoStep
            form={form}
            calculateNetPrice={calculateNetPrice}
            handleNext={handleNext}
            handleBack={handleBack}
            loading={loading}
          />
        )

      case 'review':
        return (
          <ReviewStep
            form={form}
            calculateNetPrice={calculateNetPrice}
            formatCurrency={formatCurrency}
            handleBack={handleBack}
            loading={loading}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-7xl gap-8 p-8">
        {/* Left Sidebar for Navigation */}
        <div className="w-1/4 pt-8">
          <ul className="space-y-6">
            <li className="flex items-center space-x-3">
              {getStepStatus('productInfo') === 'completed' ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${currentStep === 'productInfo' ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}
                >
                  {currentStep === 'productInfo' ? (
                    <Circle fill="currentColor" strokeWidth={0} size={10} />
                  ) : null}
                </div>
              )}
              <span
                className={`font-medium ${currentStep === 'productInfo' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Product Information
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <div
                className={`-ml-2 h-0.5 w-6 ${getStepStatus('pricingInfo') === 'current' || getStepStatus('pricingInfo') === 'completed' ? 'bg-blue-600' : 'bg-gray-300'}`}
              ></div>
              {getStepStatus('pricingInfo') === 'completed' ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${currentStep === 'pricingInfo' ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}
                >
                  {currentStep === 'pricingInfo' ? (
                    <Circle fill="currentColor" strokeWidth={0} size={10} />
                  ) : null}
                </div>
              )}
              <span
                className={`font-medium ${currentStep === 'pricingInfo' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Pricing Information
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <div
                className={`-ml-2 h-0.5 w-6 ${getStepStatus('review') === 'current' || getStepStatus('review') === 'completed' ? 'bg-blue-600' : 'bg-gray-300'}`}
              ></div>
              {getStepStatus('review') === 'completed' ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${currentStep === 'review' ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}
                >
                  {currentStep === 'review' ? (
                    <Circle fill="currentColor" strokeWidth={0} size={10} />
                  ) : null}
                </div>
              )}
              <span
                className={`font-medium ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Review
              </span>
            </li>
          </ul>
        </div>

        {/* Right Content Area for Form/Preview */}
        <div className="w-3/4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AddProductForm
