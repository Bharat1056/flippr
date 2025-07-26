import { AddProductFormData } from '@/components/common/types'
import { UseFormReturn } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export interface ImageUploadProps {
  uploadedImages: string[]
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}

export interface AdditionalInfoSectionProps {
  form: UseFormReturn<AddProductFormData>
  additionalInfoExpanded: boolean
  setAdditionalInfoExpanded: (expanded: boolean) => void
}

export interface ProductInfoStepProps {
  form: UseFormReturn<AddProductFormData>
  uploadedImages: string[]
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  additionalInfoExpanded: boolean
  setAdditionalInfoExpanded: (expanded: boolean) => void
  handleNext: () => Promise<void>
  loading: boolean
  router: ReturnType<typeof useRouter>
}

export interface PricingInfoStepProps {
  form: UseFormReturn<AddProductFormData>
  calculateNetPrice: () => string
  handleNext: () => Promise<void>
  handleBack: () => void
  loading: boolean
}

export interface ReviewStepProps {
  form: UseFormReturn<AddProductFormData>
  calculateNetPrice: () => string
  formatCurrency: (value: string | number | undefined) => string
  handleBack: () => void
  loading: boolean
}
