import { useQuery } from '@tanstack/react-query'

// Dummy staff data
const dummyStaff = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Manager' },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Sales Associate',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Inventory Specialist',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'Customer Service',
  },
]

export interface Staff {
  id: string
  name: string
  email: string
  role: string
}

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async (): Promise<Staff[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return dummyStaff
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
