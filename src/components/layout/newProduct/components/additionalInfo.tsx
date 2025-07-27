import React from 'react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { AdditionalInfoSectionProps } from '../types/index'
import { useStaff } from '@/lib/hooks/use-staff'

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  form,
  additionalInfoExpanded,
  setAdditionalInfoExpanded,
}) => {
  const { data: staff, isLoading: staffLoading } = useStaff()
  return (
    <div className="mt-8 pt-6">
      <button
        type="button"
        onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
        className="flex cursor-pointer items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        <span>Additional Info</span>
        {additionalInfoExpanded ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </button>

      {additionalInfoExpanded && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="staff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Staff
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                        <SelectValue placeholder="Select a staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffLoading ? (
                          <SelectItem value="" disabled>
                            Loading staff...
                          </SelectItem>
                        ) : staff && staff.length > 0 ? (
                          staff.map(staffMember => (
                            <SelectItem
                              key={staffMember.id}
                              value={staffMember.name}
                            >
                              {staffMember.name} - {staffMember.role}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No staff available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    SKU
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="LPX-ABC-001"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalInfoSection
